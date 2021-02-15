import { Component, OnInit } from '@angular/core';
import { ViewComponent } from '../view.component';

@Component({
  selector: 'app-standard-view',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.scss']
})
export class StandardComponent extends ViewComponent implements OnInit {

  ngOnInit() {
    this.sortContent();
  }
}
