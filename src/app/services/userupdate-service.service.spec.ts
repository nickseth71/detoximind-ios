import { TestBed } from '@angular/core/testing';

import { UserupdateServiceService } from './userupdate-service.service';

describe('UserupdateServiceService', () => {
  let service: UserupdateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserupdateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
