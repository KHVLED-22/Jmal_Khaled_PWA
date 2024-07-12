import { TestBed } from '@angular/core/testing';

import { AttributService } from './attribut.service';

describe('AttributService', () => {
  let service: AttributService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
