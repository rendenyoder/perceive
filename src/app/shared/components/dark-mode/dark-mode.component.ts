import { Component, Input, OnInit } from '@angular/core';
import { AppSettings } from '../../utility/settings';

@Component({
  selector: 'app-dark-mode',
  templateUrl: './dark-mode.component.html',
  styleUrls: ['./dark-mode.component.scss']
})
export class DarkModeComponent implements OnInit {

  @Input()
  colorRange;

  @Input()
  appSettings: AppSettings;

  isDarkMode;

  ngOnInit() {
    this.isDarkMode = this.appSettings ? this.appSettings.getMode() === 'dark' : false;
  }

  /**
   * Updates dark mode state.
   */
  updateDarkMode() {
    const mode = this.isDarkMode ? 'dark' : 'light';
    this.appSettings.setTheme(mode);
    if (this.colorRange) {
      this.colorRange = this.appSettings.getThemeAccentHue();
    }
  }
}
