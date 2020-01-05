import { Component, Input, OnInit } from '@angular/core';
import { BibleService } from '../services/bible.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input()
  searchResults = [];

  selected = {verses: {}, passages: {}};

  constructor(private bible: BibleService) { }

  ngOnInit() { }

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
      const id = version.id;
      const limit = version.results.limit;
      const query = version.results.query;
      version.results.offset += limit;
      this.bible.search(id, query, limit, version.results.offset).subscribe(results => {
        results.data.verses.forEach(res => version.results.verses.push(res));
      });
    }
  }

  // TODO: SETUP SELECT METHOD
  select(content, version, isPassage) {
    content.selected = !content.selected;
  }
}
