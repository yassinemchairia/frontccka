import { TestBed } from '@angular/core/testing';

import { CalendrierDisponibiliteServiceService } from './calendrier-disponibilite-service.service';

describe('CalendrierDisponibiliteServiceService', () => {
  let service: CalendrierDisponibiliteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendrierDisponibiliteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
