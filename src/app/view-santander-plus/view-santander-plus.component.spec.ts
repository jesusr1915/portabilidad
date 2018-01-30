import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSantanderPlusComponent } from './view-santander-plus.component';

describe('ViewSantanderPlusComponent', () => {
  let component: ViewSantanderPlusComponent;
  let fixture: ComponentFixture<ViewSantanderPlusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSantanderPlusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSantanderPlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
