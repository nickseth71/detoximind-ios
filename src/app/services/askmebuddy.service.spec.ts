import { TestBed } from '@angular/core/testing';

import { AskmebuddyService } from './askmebuddy.service';

describe('AskmebuddyService', () => {
  let service: AskmebuddyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AskmebuddyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
