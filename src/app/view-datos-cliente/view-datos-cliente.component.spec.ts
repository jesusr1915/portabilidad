import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDatosClienteComponent } from './view-datos-cliente.component';

describe('ViewDatosClienteComponent', () => {
  let component: ViewDatosClienteComponent;
  let fixture: ComponentFixture<ViewDatosClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDatosClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDatosClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
