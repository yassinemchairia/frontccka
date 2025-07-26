import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionsTechnicienComponent } from './interventions-technicien.component';

describe('InterventionsTechnicienComponent', () => {
  let component: InterventionsTechnicienComponent;
  let fixture: ComponentFixture<InterventionsTechnicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterventionsTechnicienComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterventionsTechnicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
