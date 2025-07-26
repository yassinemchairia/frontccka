import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicienValidationComponent } from './technicien-validation.component';

describe('TechnicienValidationComponent', () => {
  let component: TechnicienValidationComponent;
  let fixture: ComponentFixture<TechnicienValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicienValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicienValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
