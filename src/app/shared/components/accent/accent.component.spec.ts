import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccentComponent } from './accent.component';

describe('AccentComponent', () => {
  let component: AccentComponent;
  let fixture: ComponentFixture<AccentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
