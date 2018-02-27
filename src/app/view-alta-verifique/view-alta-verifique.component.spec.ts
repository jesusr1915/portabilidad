import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAltaVerifiqueComponent } from './view-alta-verifique.component';

describe('ViewAltaVerifiqueComponent', () => {
  let component: ViewAltaVerifiqueComponent;
  let fixture: ComponentFixture<ViewAltaVerifiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAltaVerifiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAltaVerifiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
