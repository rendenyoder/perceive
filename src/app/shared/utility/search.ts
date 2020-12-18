import { BibleService } from '../services/bible.service';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

/**
 * Represents the state of the user's search session.
 */
export class SearchState {
  searchTerm = '';
  failedTerm = '';
  hasSearched = false;
  hasSearchResults = false;
  searchResults: SearchResults;
  versionSearchTerm = '';
  versions = [];
  versionNames = [];
  filteredVersions = [];
  selectedVersions = new Set<any>();
  defaultVersion = 'de4e12af7f28f599-02';

  constructor(private bible: BibleService) {
    this.fetchVersions();
  }

  /**
   * Fetches all available bible versions.
   */
  fetchVersions() {
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
      this.selectVersions(this.defaultVersion);
    });
  }

  /**
   * Selects the version(s) passed in.
   * @param versions The version(s) being selected.
   */
  selectVersions(...versions) {
    const selected = this.versions.filter(v => versions.includes(v.id) && !v.selected);
    for (const version of selected) {
      version.selected = true;
      this.selectedVersions.add(version);
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
   * Toggle a version selection.
   * @param version The version object that has been selected.
   */
  toggleVersion(version) {
    if (version.selected && this.selectedVersions.size > 1) {
      this.selectedVersions.delete(version);
      version.selected = false;
      version.results = undefined;
    } else {
      this.selectedVersions.add(version);
      version.selected = true;
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
    const id = version.id;
    const limit = version.results.limit;
    const query = version.results.query;
    version.results.offset += limit;
    return this.bible.search(id, query, limit, version.results.offset).pipe(map(results => {
      results.data.verses.forEach(res => version.results.verses.push(res));
    }));
  }

  /**
   * Returns subscribable for executing a search with a given term.
   * @param term The search term.
   * @param limit The number of results to fetch.
   * @param offset The offset of results.
   */
  search(term, limit?, offset?) {
    if (this.selectedVersions.size === 0) {
      this.selectVersions(this.defaultVersion);
    }
    const calls = [];
    this.selectedVersions.forEach(version => {
      const id = version.id;
      const call = this.bible.search(id, term, limit, offset).pipe(
        map((results) => {
          version.results = results.data;
        })
      );
      calls.push(call);
    });
    return forkJoin(calls).pipe(map(_ => this.selectedVersions));
  }

  /**
   * Sets the current search results from a search event.
   */
  setSearchResults(results: Iterable<Version>) {
    this.hasSearched = true;
    this.searchResults = new SearchResults();
    this.searchResults.results = Array.from(results);
    if (this.searchResults.results && this.searchResults.results.length > 0) {
      this.hasSearchResults = this.searchResults.results.some(item => {
        return item.results && (item.results.total || item.results.passages);
      });
      this.versionNames = this.searchResults.results.map(res => res.name);
      if (!this.hasSearchResults) {
        this.failedTerm = this.searchTerm;
      }
    }
  }

  /**
   * Searches and selects content.
   * @param query The search query to use.
   * @param versions The version to search from.
   * @param selected The selected passages or verses. Undefined will be interpreted as select all.
   * @param limit The number of results to fetch.
   * @param offset The offset of results.
   */
  searchAndSelect(query, versions, selected, limit?, offset?) {
    this.searchTerm = query;
    if (versions) {
      this.selectVersions(...versions);
    }
    return this.search(this.searchTerm, limit, offset).pipe(map(res => {
      this.setSearchResults(res);
      res.forEach(version => {
        if (version.results && version.results.verses) {
          version.results.verses.forEach(v => {
            if (!selected || selected.includes(v.id)) {
              this.select(v, version, false);
            }
          });
        }
        if (version.results && version.results.passages) {
          version.results.passages.forEach(p => {
            if (!selected || selected.includes(p.id)) {
              this.select(p, version, true);
            }
          });
        }
      });
    }));
  }

  /**
   * Adds content to the appropriate selected object.
   * @param content The selected content.
   * @param version The selected contents version.
   * @param isPassage Whether or not the content is a passage or verse.
   */
  select(content, version, isPassage) {
    const bibleContent = isPassage ? this.searchResults.selected.passages : this.searchResults.selected.verses;
    if (!content.selected) {
      // create object to contain content and version info without results
      const selectedContent = new ContentInfo(content, Object.assign({}, version));
      selectedContent.versionInfo.results = undefined;
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
   * Checks whether the user has selected any content to view.
   */
  hasSelected() {
    const selected = this.searchResults.selected;
    return selected && (Object.keys(selected.passages).length > 0 || Object.keys(selected.verses).length > 0);
  }
}

/**
 * Class to store search results and selected content.
 */
class SearchResults {
  results: Version[] = [];
  selected: Selected = new Selected();
}

/**
 * Class to store selected verses and passages.
 */
class Selected {
  verses: { [id: string]: ContentInfo[] } = {};
  passages: { [id: string]: ContentInfo[] } = {};
}

/**
 * Class to store content along with info on version.
 */
class ContentInfo {
  content: Content;
  versionInfo: Version;

  constructor(content: Content, versionInfo: Version) {
    this.content = content;
    this.versionInfo = versionInfo;
  }
}

/**
 * Represents a Bible version as returned by https://api.scripture.api.bible v1.
 */
interface Version {
  id: string;
  dblId: string;
  relatedDbl?: any;
  name: string;
  nameLocal: string;
  abbreviation: string;
  abbreviationLocal: string;
  description: string;
  descriptionLocal: string;
  language: Language;
  countries: Country[];
  type: string;
  updatedAt: string;
  audioBibles: any[];
  selected: boolean;
  results: Results;
}

/**
 * Represents search results returned by query, returned by https://api.scripture.api.bible v1.
 */
interface Results {
  passages: Passage[];
  query: string;
  limit: number;
  offset: number;
  total: number;
  verseCount: number;
  verses: Verse[];
}

/**
 * Represents content, either a verse or passage, returned by https://api.scripture.api.bible v1.
 */
interface Content {
  id: string;
  orgId: string;
  bookId: string;
  bibleId: string;
  reference: string;
  selected: boolean;
}

/**
 * Represents a verse returned by https://api.scripture.api.bible v1.
 */
interface Verse extends Content {
  chapterId: string;
  text: string;
}

/**
 * Represents a passage returned by https://api.scripture.api.bible v1.
 */
interface Passage extends Content {
  chapterIds: string[];
  content: string;
  verseCount: number;
  copyright: string;
  expanded: boolean;
}

/**
 * Represents a country, typically associated with a version, returned by https://api.scripture.api.bible v1.
 */
interface Country {
  id: string;
  name: string;
  nameLocal: string;
}

/**
 * Represents a language, typically associated with a language, returned by https://api.scripture.api.bible v1.
 */
interface Language {
  id: string;
  name: string;
  nameLocal: string;
  script: string;
  scriptDirection: string;
}
