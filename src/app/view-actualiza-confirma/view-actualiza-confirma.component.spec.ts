import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActualizaConfirmaComponent } from './view-actualiza-confirma.component';

describe('ViewActualizaConfirmaComponent', () => {
  let component: ViewActualizaConfirmaComponent;
  let fixture: ComponentFixture<ViewActualizaConfirmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewActualizaConfirmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActualizaConfirmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
