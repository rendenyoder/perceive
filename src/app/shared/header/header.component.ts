import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BibleService } from '../services/bible.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output()
  execSearch: EventEmitter<any> = new EventEmitter();

  isGlobalExpanded = false;
  isSearchExpanded = false;
  isDarkMode = false;
  useCookies = true;

  modes = ['standard', 'column', 'rotate', 'interlinear'];
  currentMode = this.modes[0];

  defaultVersion = 'de4e12af7f28f599-02';
  selectedVersions = [];
  versions = [];
  filteredVersions = [];
  searchTerm = '';
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
      this.setDefaultVersion();
    });
  }

  /**
   * Sets the default selected version.
   */
  private setDefaultVersion() {
    const kjv = this.versions.find(version => version.id === this.defaultVersion);
    kjv.selected = true;
    this.selectedVersions.push(kjv);
  }

  /**
   * Sets the appropriate view mode.
   * @param selected The selected mode.
   */
  setMode(selected: string) {
    if (this.modes.includes(selected)) {
      this.currentMode = selected;
    } else {
      this.currentMode = this.modes[0];
    }
  }

  /**
   * Toggle a version selection.
   * @param version The version object that has been selected.
   */
  toggleVersion(version) {
    if (version.selected) {
      this.selectedVersions = this.selectedVersions.filter(selected => {
        return selected.id !== version.id;
      });
      version.selected = false;
      version.results = undefined;
    } else {
      this.selectedVersions.push(version);
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
   * Executes search and emits search results.
   */
  search() {
    if (this.searchTerm) {
      this.isGlobalExpanded = false;
      this.isSearchExpanded = false;
      if (this.selectedVersions.length === 0) {
        this.setDefaultVersion();
      }
      this.selectedVersions.forEach(version => {
        const id = version.id;
        this.bible.search(id, this.searchTerm).subscribe(results => {
          version.results = results.data;
        });
      });
      this.execSearch.emit(this.selectedVersions);
    }
  }
}
