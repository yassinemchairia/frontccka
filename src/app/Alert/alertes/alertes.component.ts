import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertService } from '../../Service/alert.service';
import { Alerte } from '../../Service/alerte.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PredictionModalComponent } from '../../Prediction/prediction-modal/prediction-modal.component';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-alertes',
  templateUrl: './alertes.component.html',
  styleUrls: ['./alertes.component.scss'],
})
export class AlertesComponent implements OnInit {
  alertes: Alerte[] = [];
  typesPannes: string[] = ['ELECTRICITE', 'CLIMATISATION', 'ENVIRONNEMENT'];
  niveauxGravite: string[] = ['BAS_CRITIQUE', 'BAS', 'NORMALE', 'CRITIQUE', 'HIGH_CRITICAL'];
  currentPage: number = 1;
  itemsPerPage: number = 3;

  selectedTypePanne: string = '';
  selectedGravite: string = '';
  selectedResolution: string = '';

  isLoading: boolean = false;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private dialog: MatDialog,
    private toastrService: NbToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAlertes();
  }

  get paginatedAlertes(): Alerte[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.alertes.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.alertes.length / this.itemsPerPage);
  }

  changerPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getAlertes(): void {
    this.isLoading = true;
    this.alertService.getAlertes().subscribe({
      next: (alertes: Alerte[]) => {
        this.alertes = [...alertes]; // Create new array to trigger change detection
        this.isLoading = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        console.error('Error fetching alerts:', error);
        this.toastrService.danger('Failed to fetch alerts', 'Error');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  filtrerAlertes(): void {
    this.isLoading = true;
    const type = this.selectedTypePanne || undefined;
    const gravite = this.selectedGravite || undefined;
    const resolution = this.selectedResolution !== '' ? this.selectedResolution === 'Résolu' : undefined;

    this.alertService.searchAlertes(type, gravite, resolution).subscribe({
      next: (alertes: Alerte[]) => {
        this.alertes = [...alertes];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error filtering alerts:', error);
        this.toastrService.danger('Failed to filter alerts', 'Error');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  resetFiltre(): void {
    this.selectedTypePanne = '';
    this.selectedGravite = '';
    this.selectedResolution = '';
    this.getAlertes();
  }

  ajouterIntervention(idAlerte: number): void {
    this.router.navigate(['/auth/INterv'], { queryParams: { idAlerte } });
  }

  predictAndResolve(alerte: Alerte): void {
    this.isLoading = true;
    this.alertService.predictSolution(alerte).subscribe({
      next: (response) => {
        this.isLoading = false;
        const dialogRef = this.dialog.open(PredictionModalComponent, {
          width: '600px',
          data: { solution: response.solution, similar_alertes: response.similar_alertes },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.isLoading = true;
            this.alertService.createIntervention(alerte.idAlerte).subscribe({
              next: (intervention) => {
                console.log('Intervention created:', intervention);
                this.toastrService.success(`Alert ${alerte.idAlerte} resolved successfully`, 'Success');
                this.getAlertes();
              },
              error: (error) => {
                console.error('Error creating intervention:', error.message || error);
                this.toastrService.danger('Failed to resolve alert', 'Error');
                this.isLoading = false;
                this.cdr.detectChanges();
              },
            });
          }
        });
      },
      error: (error) => {
        console.error('Error predicting solution:', error.message || error);
        this.toastrService.danger('Failed to predict solution', 'Error');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}