import { TestBed } from '@angular/core/testing';

import { CustomloaderService } from './customloader.service';

describe('CustomloaderService', () => {
  let service: CustomloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
