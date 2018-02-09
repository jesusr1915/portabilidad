import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCuentaSeleccionadaComponent } from './view-cuenta-seleccionada.component';

describe('ViewCuentaSeleccionadaComponent', () => {
  let component: ViewCuentaSeleccionadaComponent;
  let fixture: ComponentFixture<ViewCuentaSeleccionadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCuentaSeleccionadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCuentaSeleccionadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
