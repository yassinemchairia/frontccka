import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeInterventionsComponent } from './liste-interventions.component';

describe('ListeInterventionsComponent', () => {
  let component: ListeInterventionsComponent;
  let fixture: ComponentFixture<ListeInterventionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeInterventionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeInterventionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
