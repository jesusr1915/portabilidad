import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCuentaBienvenidaComponent } from './view-cuenta-bienvenida.component';

describe('ViewCuentaBienvenidaComponent', () => {
  let component: ViewCuentaBienvenidaComponent;
  let fixture: ComponentFixture<ViewCuentaBienvenidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCuentaBienvenidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCuentaBienvenidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
