import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionTechnicienComponent } from './intervention-technicien.component';

describe('InterventionTechnicienComponent', () => {
  let component: InterventionTechnicienComponent;
  let fixture: ComponentFixture<InterventionTechnicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterventionTechnicienComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterventionTechnicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
