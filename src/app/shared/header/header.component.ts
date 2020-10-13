import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BibleService } from '../services/bible.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  modeSettings: any;

  @Input()
  searchTerm = '';

  @Input()
  isSearchExpanded = false;

  @Output()
  execSearch: EventEmitter<any> = new EventEmitter();

  @Output()
  updateSearchTerm: EventEmitter<any> = new EventEmitter();

  @Output()
  updateSearchExpanded: EventEmitter<any> = new EventEmitter();

  @Output()
  updateIsDarkMode: EventEmitter<any> = new EventEmitter();

  isDarkMode = false;
  useCookies = true;

  defaultVersion = 'de4e12af7f28f599-02';
  selectedVersions = new Set<any>();
  versions = [];
  filteredVersions = [];
  versionSearchTerm = '';

  constructor(private bible: BibleService) { }

  ngOnInit() {
    this.bible.fetchBibles().subscribe(result => {
      this.versions = result.data;
      // sort versions
      this.versions = this.versions.sort((a, b) => {
        if (a.language.id === 'eng') {
          return -1;
        } else if (b.language.id === 'eng') {
          return 1;
        } else {
          return a.name.localeCompare(b.name);
        }
      });
      // set filtered version list to full list
      this.filteredVersions = this.versions;
      // set selected version as default
      this.selectVersions(this.defaultVersion);
    });
  }

  /**
   * Sets the appropriate view mode.
   * @param selected The selected mode.
   */
  setMode(selected: string) {
    this.modeSettings.current = selected;
  }

  /**
   * Toggle a version selection.
   * @param version The version object that has been selected.
   */
  toggleVersion(version) {
    if (version.selected && this.selectedVersions.size > 1) {
      this.selectedVersions.delete(version);
      version.selected = false;
      version.results = undefined;
    } else {
      this.selectedVersions.add(version);
      version.selected = true;
    }
  }

  /**
   * Filters out versions based on search term.
   */
  filterVersions() {
    if (this.versionSearchTerm) {
      this.filteredVersions = this.versions.filter(version => {
        const term = this.versionSearchTerm.toLowerCase();
        return version.name.toLowerCase().includes(term) || version.language.name.toLowerCase().includes(term);
      });
    } else {
      this.filteredVersions = this.versions;
    }
  }

  /**
   * Selects the version(s) passed in.
   * @param versions The version(s) being selected.
   */
  selectVersions(...versions) {
    const selected = this.versions.filter(v => versions.includes(v.id) && !v.selected);
    for (const version of selected) {
      version.selected = true;
      this.selectedVersions.add(version);
    }
  }

  /**
   * Executes search and emits search results.
   */
  search() {
    if (this.searchTerm) {
      this.isSearchExpanded = false;
      if (this.selectedVersions.size === 0) {
        this.selectVersions(this.defaultVersion);
      }
      this.doSearch(this.searchTerm).subscribe(_ => {
        this.updateSearchTerm.emit(this.searchTerm);
        this.execSearch.emit(this.selectedVersions);
      }, err => {
        this.updateSearchTerm.emit(this.searchTerm);
      });
    }
  }

  /**
   * Returns subscribable for executing a search with a given term.
   * @param term The search term.
   * @param limit The number of results to fetch.
   * @param offset The offset of results.
   */
  doSearch(term, limit?, offset?) {
    const calls = [];
    this.selectedVersions.forEach(version => {
      const id = version.id;
      const call = this.bible.search(id, term, limit, offset).pipe(
        map((results) => {
          version.results = results.data;
        })
      );
      calls.push(call);
    });
    return forkJoin(calls).pipe(map(_ => this.selectedVersions));
  }

  /**
   * Toggles the state of the search settings expanded flag.
   * @param state the new search expanded state
   */
  updateSearch(state) {
    this.isSearchExpanded = state;
    this.updateSearchExpanded.emit(this.isSearchExpanded);
  }

  /**
   * Updates dark mode state.
   */
  updateDarkMode() {
    this.updateIsDarkMode.emit(this.isDarkMode);
  }

  /**
   * Comparator to use for sorting json keys in declared order.
   */
  originalOrder = (a, b) => 0;
}
