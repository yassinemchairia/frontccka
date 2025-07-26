import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDisponibilitesComponent } from './gestion-disponibilites.component';

describe('GestionDisponibilitesComponent', () => {
  let component: GestionDisponibilitesComponent;
  let fixture: ComponentFixture<GestionDisponibilitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionDisponibilitesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionDisponibilitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
