import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RendezVousService } from '../../Service/rendez-vous.service';
import { AutoPlanificationRequest, RendezVous, RendezVousRequest, SuggestionResponse } from '../../Service/AutoPlanificationRequest';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'ngx-planification',
  templateUrl: './planification.component.html',
  styleUrls: ['./planification.component.scss']
})
export class PlanificationComponent {
  planificationForm: FormGroup;
  suggestions: RendezVous[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  warningMessage: string | null = null;
  specialites: string[] = ['ELECTRICITE', 'CLIMATISATION', 'ENVIRONNEMENT'];
  displayedColumns: string[] = ['date', 'description', 'techniciens', 'actions'];

  constructor(
    private fb: FormBuilder,
    private rendezVousService: RendezVousService,
    private snackBar: MatSnackBar
  ) {
    this.planificationForm = this.fb.group({
      adminId: [13, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      dateSouhaitee: ['', Validators.required],
      dateLimite: [''],
      specialiteRequise: ['', Validators.required],
      nombreTechniciensRequis: [1, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
    console.log('FormGroup initialized:', this.planificationForm.controls);
  }

  onSubmit(): void {
    if (this.planificationForm.invalid) {
      this.showSnackbar('Veuillez remplir tous les champs requis.', 'error');
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.warningMessage = null;

    const formValue = this.planificationForm.value;
    const request: AutoPlanificationRequest = {
      adminId: formValue.adminId,
      description: formValue.description,
      dateSouhaitee: this.formatDate(formValue.dateSouhaitee),
      dateLimite: formValue.dateLimite ? this.formatDate(formValue.dateLimite) : undefined,
      specialiteRequise: formValue.specialiteRequise,
      nombreTechniciensRequis: formValue.nombreTechniciensRequis
    };

    this.rendezVousService.getSuggestions(request).subscribe({
      next: (response: SuggestionResponse) => {
        this.suggestions = response.suggestions || [];
        this.isLoading = false;
        
        if (response.warning) {
          this.warningMessage = response.warning;
          this.showSnackbar(response.warning, 'warning');
        }
        
        if (this.suggestions.length === 0) {
          this.errorMessage = 'Aucune suggestion disponible pour les critères sélectionnés.';
          this.showSnackbar(this.errorMessage, 'info');
        }
      },
      error: (err) => {
        this.isLoading = false;
        let errorMsg = err.message || 'Une erreur inattendue est survenue.';
        if (errorMsg.startsWith('Erreur : ')) {
          errorMsg = errorMsg.replace('Erreur : ', '');
        }
        if (errorMsg.includes('Aucun technicien disponible pour la période et la spécialité demandées')) {
          this.errorMessage = 'Aucun technicien disponible pour la période et la spécialité sélectionnées.';
          this.showSnackbar(this.errorMessage, 'error');
        } else {
          this.errorMessage = errorMsg;
          this.showSnackbar(errorMsg, 'error');
        }
        console.error('Error details:', err);
      }
    });
  }

  confirmerRendezVous(suggestion: RendezVous): void {
    let dateToSend: string;
    try {
      dateToSend = new Date(suggestion.dateRendezVous).toISOString();
    } catch (e) {
      console.error('Erreur de conversion de date:', e);
      this.showSnackbar('Format de date invalide', 'error');
      return;
    }

    const request: RendezVousRequest = {
      adminId: suggestion.administrateur.idUser,
      description: suggestion.description,
      date: dateToSend,
      technicienIds: suggestion.techniciens.map(tech => tech.idUser)
    };

    this.rendezVousService.createRendezVous(request).subscribe({
      next: (response) => {
        this.suggestions = this.suggestions.filter(s => s !== suggestion);
        this.showSnackbar('Rendez-vous confirmé avec succès!', 'success');
      },
      error: (err) => {
        this.showSnackbar(`Erreur: ${err.message}`, 'error');
        console.error('Détails de l\'erreur:', err.details || err);
      }
    });
  }

  private formatDate(date: string | Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private showSnackbar(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: [`snackbar-${type}`],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}