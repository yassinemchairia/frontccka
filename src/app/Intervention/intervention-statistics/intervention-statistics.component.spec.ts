import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionStatisticsComponent } from './intervention-statistics.component';

describe('InterventionStatisticsComponent', () => {
  let component: InterventionStatisticsComponent;
  let fixture: ComponentFixture<InterventionStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterventionStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterventionStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
