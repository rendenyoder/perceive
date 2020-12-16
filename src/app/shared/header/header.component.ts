import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppSettings } from '../model/settings';
import { SearchState } from '../model/search';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  modeSettings: any;

  @Input()
  appSettings: AppSettings;

  @Input()
  searchState: SearchState;

  @Input()
  isSearchExpanded = false;

  @Output()
  execSearch: EventEmitter<any> = new EventEmitter();

  @Output()
  updateSearchExpanded: EventEmitter<any> = new EventEmitter();

  isDarkMode;
  colorRange;

  constructor() { }

  ngOnInit() {
    this.isDarkMode = this.appSettings ? this.appSettings.getMode() === 'dark' : false;
    this.colorRange = this.appSettings.getThemeAccentHue();
  }

  /**
   * Sets the appropriate view mode.
   * @param selected The selected mode.
   */
  setMode(selected: string) {
    this.modeSettings.current = selected;
  }

  /**
   * Executes search and emits success or failure.
   */
  search() {
    if (this.searchState.searchTerm) {
      this.isSearchExpanded = false;
      this.searchState.search(this.searchState.searchTerm).subscribe(results => {
        this.searchState.setSearchResults(results);
        this.execSearch.emit(true);
      }, error => {
        this.execSearch.emit(false);
      });
    }
  }

  /**
   * Updates theme accent based on color slider.
   */
  updateAccent() {
    this.appSettings.setThemeAccentHue(this.colorRange);
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
    const mode = this.isDarkMode ? 'dark' : 'light';
    this.appSettings.setTheme(mode);
    this.colorRange = this.appSettings.getThemeAccentHue();
  }

  /**
   * Comparator to use for sorting json keys in declared order.
   */
  originalOrder = (a, b) => 0;
}
