import { TestBed } from '@angular/core/testing';

import { TechnicienStatsService } from './technicien-stats.service';

describe('TechnicienStatsService', () => {
  let service: TechnicienStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechnicienStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
