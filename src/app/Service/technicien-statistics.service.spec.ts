import { TestBed } from '@angular/core/testing';

import { TechnicienStatisticsService } from './technicien-statistics.service';

describe('TechnicienStatisticsService', () => {
  let service: TechnicienStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechnicienStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
