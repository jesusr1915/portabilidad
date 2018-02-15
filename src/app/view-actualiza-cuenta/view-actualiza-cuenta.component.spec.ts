import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActualizaCuentaComponent } from './view-actualiza-cuenta.component';

describe('ViewActualizaCuentaComponent', () => {
  let component: ViewActualizaCuentaComponent;
  let fixture: ComponentFixture<ViewActualizaCuentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewActualizaCuentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActualizaCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
