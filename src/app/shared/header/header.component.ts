import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isExpanded = false;
  isDarkMode = false;
  useCookies = false;

  modes = ['standard', 'column', 'rotate', 'interlinear'];
  currentMode = this.modes[0];

  constructor() { }

  ngOnInit() { }

  setMode(selected: string) {
    if (this.modes.includes(selected)) {
      this.currentMode = selected;
    } else {
      this.currentMode = this.modes[0];
    }
  }
}
