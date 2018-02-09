import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewResumenInscripcionComponent } from './view-resumen-inscripcion.component';

describe('ViewResumenInscripcionComponent', () => {
  let component: ViewResumenInscripcionComponent;
  let fixture: ComponentFixture<ViewResumenInscripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewResumenInscripcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewResumenInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
