import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicienStatsComponent } from './technicien-stats.component';

describe('TechnicienStatsComponent', () => {
  let component: TechnicienStatsComponent;
  let fixture: ComponentFixture<TechnicienStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicienStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicienStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
