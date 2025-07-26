import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapteurStatisticsComponent } from './capteur-statistics.component';

describe('CapteurStatisticsComponent', () => {
  let component: CapteurStatisticsComponent;
  let fixture: ComponentFixture<CapteurStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapteurStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapteurStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
