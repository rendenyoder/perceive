import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ViewComponent } from '../view.component';

@Component({
  selector: 'app-column-view',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent extends ViewComponent implements OnInit {

  @ViewChild('passageContent', {static: false}) passageContent;

  @ViewChild('passageGroup', {static: false}) passageGroup;

  isSmartScrollEnabled = true;

  ngOnInit() {
    this.sortContent();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    this.setTop(false);
  }

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    this.setTop(true);
  }

  /**
   * Toggle smart scroll.
   */
  toggleSmartScroll() {
    this.isSmartScrollEnabled = !this.isSmartScrollEnabled;
    this.setTop(false);
  }

  /**
   * Set top style to ease scrolling of side-by-side content of different heights.
   * @param refresh Whether to refresh the stored distance from top value for a passage/verse.
   */
  private setTop(refresh) {
    const parent = this.passageGroup.nativeElement;
    for (const child of parent.children) {
      // refresh topDist if window has been re-sized
      if (refresh || child.topDist === undefined) {
        child.topDist = child.getBoundingClientRect().top + window.scrollY;
      }
      // calculate offset for top if applicable
      for (const content of child.children) {
        if (this.isSmartScrollEnabled) {
          const diff = child.offsetHeight - content.offsetHeight;
          if (diff > 200) {
            child.isTopSet = true;
            content.style.top = this.calculateOffset(diff, child) + 'px';
          } else if (child.isTopSet) {
            content.style.top = '0px';
          }
        } else {
          content.style.top = '0px';
        }
      }
    }
  }

  /**
   * Calculates the desired top offset.
   * @param diff Difference between the passage/verse height and the height of the longest passage/verse.
   * @param child The given passage/verse container.
   */
  private calculateOffset(diff, child) {
    const percent = (window.scrollY - child.topDist) / (child.offsetHeight - window.innerHeight);
    return Math.round(diff * Math.max(0, Math.min(percent, 1)));
  }
}
