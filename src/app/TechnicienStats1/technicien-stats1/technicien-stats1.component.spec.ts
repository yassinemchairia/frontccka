import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicienStats1Component } from './technicien-stats1.component';

describe('TechnicienStats1Component', () => {
  let component: TechnicienStats1Component;
  let fixture: ComponentFixture<TechnicienStats1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicienStats1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicienStats1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
