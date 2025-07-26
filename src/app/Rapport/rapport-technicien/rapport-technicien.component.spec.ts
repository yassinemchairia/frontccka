import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportTechnicienComponent } from './rapport-technicien.component';

describe('RapportTechnicienComponent', () => {
  let component: RapportTechnicienComponent;
  let fixture: ComponentFixture<RapportTechnicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RapportTechnicienComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportTechnicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
