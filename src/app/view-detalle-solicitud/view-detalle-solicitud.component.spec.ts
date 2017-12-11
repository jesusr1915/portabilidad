import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetalleSolicitudComponent } from './view-detalle-solicitud.component';

describe('ViewDetalleSolicitudComponent', () => {
  let component: ViewDetalleSolicitudComponent;
  let fixture: ComponentFixture<ViewDetalleSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDetalleSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetalleSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
