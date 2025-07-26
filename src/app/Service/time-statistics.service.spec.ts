import { TestBed } from '@angular/core/testing';

import { TimeStatisticsService } from './time-statistics.service';

describe('TimeStatisticsService', () => {
  let service: TimeStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
