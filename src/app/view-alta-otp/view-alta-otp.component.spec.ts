import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAltaOtpComponent } from './view-alta-otp.component';

describe('ViewAltaOtpComponent', () => {
  let component: ViewAltaOtpComponent;
  let fixture: ComponentFixture<ViewAltaOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAltaOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAltaOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
