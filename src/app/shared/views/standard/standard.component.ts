import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-standard-view',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.scss']
})
export class StandardComponent implements OnInit {

  @Input()
  content = {verses: {}, passages: {}};

  isAlphabetized = false;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() { }

  /**
   * Checks if a given passage or verse group has content.
   * @param bibleContent A given passage or verse.
   */
  hasContent = (bibleContent) => bibleContent && Object.keys(bibleContent).length > 0;

  /**
   * Toggles alphabetical sorting and updates content.
   */
  toggleAlphabetical() {
    this.isAlphabetized = !this.isAlphabetized;
    this.cdr.detectChanges();
  }

  /**
   * List of keys sorted by preference.
   * @param content The verse or passage content.
   */
  keys(content) {
    const keys = Object.keys(content);
    if (this.isAlphabetized) {
      const moveChapter = (str) => str.substr(2).replace(' ', str[0]);
      return keys.sort((a, b) => {
        const regex = /^[[0-9]/;
        let first = content[a][0].content.reference;
        let second = content[b][0].content.reference;
        if (regex.test(first)) {
          first = moveChapter(first);
        }
        if (regex.test(second)) {
          second = moveChapter(second);
        }
        return first.localeCompare(second);
      });
    }
    return keys;
  }
}
