import { TestBed } from '@angular/core/testing';

import { GenericoService } from './generico.service';

describe('GenericoService', () => {
  let service: GenericoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenericoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
