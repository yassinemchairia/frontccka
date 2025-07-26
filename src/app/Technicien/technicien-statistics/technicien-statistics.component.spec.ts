import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicienStatisticsComponent } from './technicien-statistics.component';

describe('TechnicienStatisticsComponent', () => {
  let component: TechnicienStatisticsComponent;
  let fixture: ComponentFixture<TechnicienStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicienStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicienStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
