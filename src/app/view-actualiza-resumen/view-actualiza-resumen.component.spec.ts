import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActualizaResumenComponent } from './view-actualiza-resumen.component';

describe('ViewActualizaResumenComponent', () => {
  let component: ViewActualizaResumenComponent;
  let fixture: ComponentFixture<ViewActualizaResumenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewActualizaResumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActualizaResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
