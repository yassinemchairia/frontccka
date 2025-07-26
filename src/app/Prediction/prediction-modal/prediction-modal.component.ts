import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-prediction-modal',
  templateUrl: './prediction-modal.component.html',
  styleUrls: ['./prediction-modal.component.scss'],
})
export class PredictionModalComponent {
  // Define the columns to be displayed in the Angular Material table
  displayedColumns: string[] = [
    'typePanne',
    'niveauGravite',
    'typeCapteur',
    'emplacement',
    'valeurDeclenchement',
    'description',
    'solution',
    'satisfaction',
  ];

  constructor(
    public dialogRef: MatDialogRef<PredictionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { solution: string; similar_alertes: any[] }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Helper function to get severity class for styling
  getSeverityClass(level: string): string {
    switch (level) {
      case 'Faible':
        return 'severity-low';
      case 'Moyenne':
        return 'severity-medium';
      case 'Élevée': // Or "Haute" depending on your data
        return 'severity-high';
      default:
        return '';
    }
  }
}