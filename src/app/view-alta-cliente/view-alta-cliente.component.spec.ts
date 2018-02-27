import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAltaClienteComponent } from './view-alta-cliente.component';

describe('ViewAltaClienteComponent', () => {
  let component: ViewAltaClienteComponent;
  let fixture: ComponentFixture<ViewAltaClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAltaClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAltaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
