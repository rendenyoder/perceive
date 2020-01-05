import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  searchResults = [];

  constructor() { }

  ngOnInit() { }

  /**
   * Sets the current search results from a search event.
   */
  setSearchResults($event) {
    this.searchResults = $event;
  }
}
