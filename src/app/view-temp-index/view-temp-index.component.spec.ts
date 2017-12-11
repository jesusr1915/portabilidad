import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTempIndexComponent } from './view-temp-index.component';

describe('ViewTempIndexComponent', () => {
  let component: ViewTempIndexComponent;
  let fixture: ComponentFixture<ViewTempIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTempIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTempIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
