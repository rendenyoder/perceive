import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { BibleService } from '../services/bible.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input()
  searchResults = {results: []};

  @Output()
  display: EventEmitter<any> = new EventEmitter();

  selected = {verses: {}, passages: {}};

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
      const results = this.searchResults.results;
      if (results.length === 1) {
        const version = results[0];
        if (version.results && this.hasContent(version) && version.results.verses && this.hasMoreResults(version) && !this.isFetching) {
          this.addResults(version);
        }
      }
    }
  }

  /**
   * Whether or not a version has results.
   * @param version Version object possibly containing search results.
   */
  hasContent(version) {
    const hasVerses = version.results.verses && version.results.verses.length > 0;
    const hasPassages = version.results.passages && version.results.passages.length > 0;
    return hasVerses || hasPassages;
  }

  /**
   * Whether or not a version has mroe search results.
   * @param version Version object containing search results.
   */
  hasMoreResults = (version) => version.results.total > version.results.verses.length && version.results.total > version.results.limit;

  /**
   * Adds more search results to a given version.
   * @param version Version object containing search results.
   */
  addResults(version) {
    if (this.hasMoreResults(version)) {
      this.isFetching = true;
      const id = version.id;
      const limit = version.results.limit;
      const query = version.results.query;
      version.results.offset += limit;
      this.bible.search(id, query, limit, version.results.offset).subscribe(results => {
        this.isFetching = false;
        results.data.verses.forEach(res => version.results.verses.push(res));
      });
    }
  }

  /**
   * Checks whether the user has selected any content to view.
   */
  hasSelected() {
    const selected = this.searchResults['selected'];
    return selected && (Object.keys(selected.passages).length > 0 || Object.keys(selected.verses).length > 0);
  }

  /**
   * Adds content to the appropriate selected object.
   * @param content The selected content.
   * @param version The selected contents version.
   * @param isPassage Whether or not the content is a passage or verse.
   */
  select(content, version, isPassage) {
    if (!this.searchResults['selected']) {
      this.searchResults['selected'] = {verses: {}, passages: {}};
    }
    const bibleContent = isPassage ? this.searchResults['selected'].passages : this.searchResults['selected'].verses;
    if (!content.selected) {
      // create object to contain content and version info without results
      const selectedContent = {content, versionInfo: undefined};
      const versionInfo = Object.assign({}, version);
      versionInfo.results = undefined;
      selectedContent.versionInfo = versionInfo;
      // put content at id of passage or verse
      const contentList = bibleContent[selectedContent.content.id];
      if (contentList) {
        contentList.push(selectedContent);
      } else {
        bibleContent[selectedContent.content.id] = [selectedContent];
      }
      content.selected = true;
    } else {
      if (bibleContent[content.id]) {
        bibleContent[content.id] = bibleContent[content.id].filter(item => item.versionInfo.id !== version.id);
        // remove list if empty
        if (bibleContent[content.id].length <= 0) {
          delete bibleContent[content.id];
        }
      }
      content.selected = false;
    }
  }

  /**
   * Emit selected search results.
   */
  displayResults() {
    if (this.searchResults['selected']) {
      window.scroll(0, 0);
      this.display.emit(this.searchResults['selected']);
    }
  }
}
