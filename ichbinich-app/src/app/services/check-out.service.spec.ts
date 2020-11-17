import { TestBed } from '@angular/core/testing';

import { CheckOutService } from './check-out.service';

describe('CheckOutService', () => {
  let service: CheckOutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckOutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
