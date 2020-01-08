import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-standard-view',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.scss']
})
export class StandardComponent implements OnInit {

  @Input()
  content = {verses: {}, passages: {}};

  constructor() { }

  ngOnInit() { }

  /**
   * Checks if a given passage or verse group has content.
   * @param bibleContent A given passage or verse.
   */
  hasContent = (bibleContent) => bibleContent && Object.keys(bibleContent).length > 0;
}
