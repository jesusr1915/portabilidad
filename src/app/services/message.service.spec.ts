import { TestBed, inject } from '@angular/core/testing';

import { MesageService } from './mesage.service';

describe('MesageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MesageService]
    });
  });

  it('should be created', inject([MesageService], (service: MesageService) => {
    expect(service).toBeTruthy();
  }));
});
