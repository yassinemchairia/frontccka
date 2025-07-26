import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeStatisticsComponent } from './time-statistics.component';

describe('TimeStatisticsComponent', () => {
  let component: TimeStatisticsComponent;
  let fixture: ComponentFixture<TimeStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
