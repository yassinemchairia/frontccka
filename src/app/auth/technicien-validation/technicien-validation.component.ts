import { Component, OnInit  } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'ngx-technicien-validation',
  templateUrl: './technicien-validation.component.html',
  styleUrls: ['./technicien-validation.component.scss']
})
export class TechnicienValidationComponent implements OnInit {

  techniciens: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.chargerTechniciensNonValides();
  }

  chargerTechniciensNonValides(): void {
    this.authService.getTechniciensNonValidés().subscribe({
      next: (data) => this.techniciens = data,
      error: (err) => console.error('Erreur de chargement des techniciens', err)
    });
  }

  valider(technicien: any, isApproved: boolean): void {
    this.authService.validerTechnicien(technicien.idUser, isApproved).subscribe({
      next: () => {
        this.chargerTechniciensNonValides();
      },
      error: (err) => {
        console.error("Erreur lors de la validation/rejet", err);
      }
    });
  }
  

}