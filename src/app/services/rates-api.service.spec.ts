import { TestBed } from '@angular/core/testing';

import { RatesApiService } from './rates-api.service';

describe('RatesApiService', () => {
  let service: RatesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RatesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
