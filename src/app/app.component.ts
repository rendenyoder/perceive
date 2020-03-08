import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  searchTerm = '';
  isSearchExpanded = false;
  isGlobalExpanded = false;
  hasSearched = false;
  isReadView = false;
  isHeaderHidden = false;
  searchResults = {};
  modeSettings = { current: 'standard', modes: ['standard', 'column', 'rotate', 'interlinear'] };
  content = {};
  zoom = { factor: 1, step: 0.1, min: 1, max: 2 };

  constructor() { }

  ngOnInit() { }

  /**
   * Checks whether any search results are present.
   */
  hasSearchResults() {
    if (this.searchResults['results']) {
      return this.searchResults['results'].some(item => item.results && (item.results.total || item.results.passages));
    }
    return false;
  }

  /**
   * Sets the current search results from a search event.
   */
  setSearchResults($event) {
    this.hasSearched = true;
    this.isReadView = false;
    this.searchResults = {results: $event};
  }

  /**
   * Displays the selected content.
   * @param $event The content to be displayed.
   */
  display($event) {
    this.isHeaderHidden = true;
    this.isReadView = true;
    this.content = $event;
  }

  /**
   * Increases the current zoom factor.
   */
  zoomIn() {
    if (this.zoom.factor < this.zoom.max) {
      this.zoom.factor += this.zoom.step;
    }
  }

  /**
   * Decreases the current zoom factor.
   */
  zoomOut() {
    if (this.zoom.factor > this.zoom.min) {
      this.zoom.factor -= this.zoom.step;
    }
  }

  /**
   * Updates the state of the search settings expanded flag.
   * @param $event the new state.
   */
  updateSearch($event) {
    this.isSearchExpanded = $event;
  }

  /**
   * Updates the state of the global settings expanded flag.
   * @param $event the new state.
   */
  updateGlobal($event) {
    this.isGlobalExpanded = $event;
  }

  /**
   * Closes the current content view.
   */
  close() {
    this.isHeaderHidden = false;
    this.isReadView = false;
  }

  /**
   * Scrolls view to the updated element and updates search term.
   * @param $element the updated element.
   * @param term the new search term.
   */
  updateSearchTerm($element, term) {
    this.isSearchExpanded = false;
    this.isGlobalExpanded = false;
    this.scrollToElement($element, () => this.searchTerm = term);
  }

  /**
   * Scrolls view to the updated element and updates global expanded state.
   * @param $element the updated element.
   * @param state the new global expanded state.
   */
  updateGlobalExpand($element, state) {
    this.isSearchExpanded = false;
    this.scrollToElement($element, () => this.isGlobalExpanded = state);
  }

  /**
   * Scrolls view to the updated element and updates search expanded state.
   * @param $element the updated element.
   * @param state the new search expanded state.
   */
  updateSearchExpand($element, state) {
    this.isGlobalExpanded = false;
    this.scrollToElement($element, () => this.isSearchExpanded = state);
  }

  /**
   * Scrolls to given element.
   * @param $element the element to scroll to.
   */
  private scrollToElement($element, lambda): void {
    $element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    setTimeout(() => lambda(), 150);
  }
}
