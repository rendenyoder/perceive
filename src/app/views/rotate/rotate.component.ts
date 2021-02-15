import { Component, OnInit } from '@angular/core';
import { ViewComponent } from '../view.component';

@Component({
  selector: 'app-rotate-view',
  templateUrl: './rotate.component.html',
  styleUrls: ['./rotate.component.scss']
})
export class RotateComponent extends ViewComponent implements OnInit {

  ngOnInit() {
    this.sortContent();
  }

  next(list) {
    list.push(list.shift());
  }

  back(list) {
    list.unshift(list.pop());
  }
}
