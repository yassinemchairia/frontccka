import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutHistoriqueComponent } from './ajout-historique.component';

describe('AjoutHistoriqueComponent', () => {
  let component: AjoutHistoriqueComponent;
  let fixture: ComponentFixture<AjoutHistoriqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutHistoriqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutHistoriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
