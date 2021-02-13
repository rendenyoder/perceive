import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppSettings } from '../shared/utility/settings';
import { SearchState } from '../shared/utility/search';

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

  colorRange;

  constructor() { }

  ngOnInit() { }

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
   * Toggles the state of the search settings expanded flag.
   * @param state the new search expanded state
   */
  updateSearch(state) {
    this.isSearchExpanded = state;
    this.updateSearchExpanded.emit(this.isSearchExpanded);
  }
}
