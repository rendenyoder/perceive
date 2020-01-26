import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isReadView = false;
  isHeaderHidden = false;
  searchResults = {};
  modeSettings = { current: 'standard', modes: ['standard', 'column', 'rotate', 'interlinear'] };
  content = {};

  constructor() { }

  ngOnInit() { }

  /**
   * Sets the current search results from a search event.
   */
  setSearchResults($event) {
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
   * Closes the current content view.
   */
  close() {
    this.isHeaderHidden = false;
    this.isReadView = false;
  }
}
