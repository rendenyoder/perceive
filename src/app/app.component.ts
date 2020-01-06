import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isReadView = false;
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

  display($event) {
    this.isReadView = true;
    this.content = $event;
  }
}
