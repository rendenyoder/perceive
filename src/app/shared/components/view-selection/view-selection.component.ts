import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-view-selection',
  templateUrl: './view-selection.component.html',
  styleUrls: ['./view-selection.component.scss']
})
export class ViewSelectionComponent {

  @Input()
  modeSettings: any;

  constructor() { }

  /**
   * Sets the appropriate view mode.
   * @param selected The selected mode.
   */
  setMode(selected: string) {
    this.modeSettings.current = selected;
  }

  /**
   * Comparator to use for sorting json keys in declared order.
   */
  originalOrder = (a, b) => 0;
}
