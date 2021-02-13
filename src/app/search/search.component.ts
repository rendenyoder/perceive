import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { BibleService } from '../shared/services/bible.service';
import { SearchState } from '../shared/utility/search';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input()
  searchState: SearchState;

  @Output()
  display: EventEmitter<any> = new EventEmitter();

  private isFetching = false;

  constructor(private bible: BibleService) { }

  ngOnInit() { }

  /**
   * Detects when the window has been scrolled to the bottom and will
   * load more results if there is only one version being used and there
   * are more results to fetch.
   */
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    if ((document.body.clientHeight + window.scrollY) + 500 >= document.body.scrollHeight) {
      const results = this.searchState.searchResults.results;
      if (results.length === 1) {
        const version = results[0];
        if (version.results && this.searchState.hasContent(version) && version.results.verses && this.searchState.hasMoreResults(version)) {
          if (!this.isFetching) {
            this.addResults(version);
          }
        }
      }
    }
  }

  /**
   * Adds more search results to a given version.
   * @param version Version object containing search results.
   */
  addResults(version) {
    if (this.searchState.hasMoreResults(version)) {
      this.isFetching = true;
      this.searchState.addResults(version).subscribe(_ => {
        this.isFetching = false;
      }, error => {
        // TODO: Case where search fails.
      });
    }
  }

  /**
   * Toggles the expanded state of a passage.
   * @param $event The click event.
   * @param passage The given passage.
   */
  toggleExpand($event, passage) {
    passage.expanded = !passage.expanded;
    $event.stopPropagation();
  }

  /**
   * Emit selected search results.
   */
  displayResults() {
    if (this.searchState.searchResults.selected) {
      window.scroll(0, 0);
      this.display.emit();
    }
  }
}
