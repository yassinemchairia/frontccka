import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionDetailsModalComponent } from './intervention-details-modal.component';

describe('InterventionDetailsModalComponent', () => {
  let component: InterventionDetailsModalComponent;
  let fixture: ComponentFixture<InterventionDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterventionDetailsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterventionDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
