import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutInterventionComponent } from './ajout-intervention.component';

describe('AjoutInterventionComponent', () => {
  let component: AjoutInterventionComponent;
  let fixture: ComponentFixture<AjoutInterventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutInterventionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
