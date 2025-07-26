import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostStatisticsComponent } from './cost-statistics.component';

describe('CostStatisticsComponent', () => {
  let component: CostStatisticsComponent;
  let fixture: ComponentFixture<CostStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
