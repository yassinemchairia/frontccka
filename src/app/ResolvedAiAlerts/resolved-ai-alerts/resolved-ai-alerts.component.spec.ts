import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolvedAiAlertsComponent } from './resolved-ai-alerts.component';

describe('ResolvedAiAlertsComponent', () => {
  let component: ResolvedAiAlertsComponent;
  let fixture: ComponentFixture<ResolvedAiAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResolvedAiAlertsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolvedAiAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
