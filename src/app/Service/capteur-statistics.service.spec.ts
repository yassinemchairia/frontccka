import { TestBed } from '@angular/core/testing';

import { CapteurStatisticsService } from './capteur-statistics.service';

describe('CapteurStatisticsService', () => {
  let service: CapteurStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapteurStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
