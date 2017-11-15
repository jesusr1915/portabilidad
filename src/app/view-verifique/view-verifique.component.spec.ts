import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVerifiqueComponent } from './view-verifique.component';

describe('ViewVerifiqueComponent', () => {
  let component: ViewVerifiqueComponent;
  let fixture: ComponentFixture<ViewVerifiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVerifiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVerifiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
