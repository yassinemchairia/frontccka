import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertStatisticsComponent } from './alert-statistics.component';

describe('AlertStatisticsComponent', () => {
  let component: AlertStatisticsComponent;
  let fixture: ComponentFixture<AlertStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
