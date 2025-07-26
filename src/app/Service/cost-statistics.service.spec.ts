import { TestBed } from '@angular/core/testing';

import { CostStatisticsService } from './cost-statistics.service';

describe('CostStatisticsService', () => {
  let service: CostStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
