import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConsultaComponent } from './view-consulta.component';

describe('ViewConsultaComponent', () => {
  let component: ViewConsultaComponent;
  let fixture: ComponentFixture<ViewConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
