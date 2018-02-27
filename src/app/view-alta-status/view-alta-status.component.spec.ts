import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAltaStatusComponent } from './view-alta-status.component';

describe('ViewAltaStatusComponent', () => {
  let component: ViewAltaStatusComponent;
  let fixture: ComponentFixture<ViewAltaStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAltaStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAltaStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
