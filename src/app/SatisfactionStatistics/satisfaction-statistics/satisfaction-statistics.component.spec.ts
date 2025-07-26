import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatisfactionStatisticsComponent } from './satisfaction-statistics.component';

describe('SatisfactionStatisticsComponent', () => {
  let component: SatisfactionStatisticsComponent;
  let fixture: ComponentFixture<SatisfactionStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SatisfactionStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SatisfactionStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
