import { ChangeDetectorRef, Injectable, Input } from '@angular/core';

@Injectable()
export class ViewComponent {

  @Input()
  content = {verses: {}, passages: {}};

  @Input()
  zoom = 1;

  isAlphabetized = false;
  isAlphabetizable = false;
  sortedContent = {verses: [], passages: []};

  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * Checks if a given passage or verse group has content.
   * @param bibleContent A given passage or verse.
   */
  hasContent = (bibleContent) => bibleContent && Object.keys(bibleContent).length > 0;

  /**
   * Checks if the selected content contains multiple different chapters or verses.
   */
  isMultipleSelected() {
    return Object.keys(this.content.verses).length > 1 || Object.keys(this.content.passages).length > 1;
  }

  /**
   * Toggles alphabetical sorting and updates content.
   */
  toggleAlphabetical() {
    this.isAlphabetized = !this.isAlphabetized;
    this.sortContent();
    // TODO: Should not be using this
    this.cdr.detectChanges();
  }

  /**
   * Content sorted by preference.
   * @param content The verse or passage content.
   */
  sorted(content) {
    const sorted = [];
    const keys = Object.keys(content);
    if (keys.length) {
      keys.forEach(k => sorted.push(Object.assign([], content[k])));
      if (this.isAlphabetized) {
        // sort passages or verses in each group alphabetically
        sorted.forEach(group => {
          group.sort((a, b) => a.content.reference.localeCompare(b.content.reference));
        });
        // sort each group by first verse or passage
        const regex = /^[[0-9]/;
        const moveChapter = (str) => str.substr(2).replace(' ', str[0]);
        sorted.sort((a, b) => {
          let first = a[0].content.reference;
          let second = b[0].content.reference;
          if (regex.test(first)) {
            first = moveChapter(first);
          }
          if (regex.test(second)) {
            second = moveChapter(second);
          }
          return first.localeCompare(second);
        });
      }
    }
    return sorted;
  }

  /**
   * Sorts verses and passages.
   */
  sortContent() {
    this.sortedContent.verses = this.sorted(this.content.verses);
    this.sortedContent.passages = this.sorted(this.content.passages);
  }
}
