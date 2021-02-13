import {Component, Input, OnInit} from '@angular/core';
import { AppSettings } from '../../utility/settings';

@Component({
  selector: 'app-accent-slider',
  templateUrl: './accent.component.html',
  styleUrls: ['./accent.component.scss']
})
export class AccentComponent implements OnInit {

  @Input()
  colorRange;

  @Input()
  appSettings: AppSettings;

  ngOnInit() {
    this.colorRange = this.appSettings.getThemeAccentHue();
  }

  /**
   * Updates theme accent based on color slider.
   */
  updateAccent() {
    this.appSettings.setThemeAccentHue(this.colorRange);
  }
}
