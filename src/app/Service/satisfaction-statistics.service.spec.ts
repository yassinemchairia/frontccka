import { TestBed } from '@angular/core/testing';

import { SatisfactionStatisticsService } from './satisfaction-statistics.service';

describe('SatisfactionStatisticsService', () => {
  let service: SatisfactionStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SatisfactionStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
