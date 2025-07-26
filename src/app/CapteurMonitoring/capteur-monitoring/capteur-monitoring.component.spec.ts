import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapteurMonitoringComponent } from './capteur-monitoring.component';

describe('CapteurMonitoringComponent', () => {
  let component: CapteurMonitoringComponent;
  let fixture: ComponentFixture<CapteurMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapteurMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapteurMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
