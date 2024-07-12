import { TestBed } from '@angular/core/testing';

import { CouleurService } from './couleur.service';

describe('CouleurService', () => {
  let service: CouleurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CouleurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
