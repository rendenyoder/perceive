/**
 * Class to store search results and selected content.
 */
export class SearchResults {
  results: Version[] = [];
  selected: Selected = new Selected();
}

/**
 * Class to store selected verses and passages.
 */
export class Selected {
  verses: { [id: string]: ContentInfo[] } = {};
  passages: { [id: string]: ContentInfo[] } = {};
}

/**
 * Class to store content along with info on version.
 */
export class ContentInfo {
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
 * Represents search results returned by query.
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
