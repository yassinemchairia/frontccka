import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertService } from '../../Service/alert.service';
import { Alerte } from '../../Service/alerte.model';
import { NbToastrService } from '@nebular/theme';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InterventionDetailsModalComponent } from '../../yy/intervention-details-modal/intervention-details-modal.component';

@Component({
  selector: 'app-resolved-ai-alerts',
  templateUrl: './resolved-ai-alerts.component.html',
  styleUrls: ['./resolved-ai-alerts.component.scss'],
})
export class ResolvedAiAlertsComponent implements OnInit {
  resolvedAiAlerts: Alerte[] = [];
  isLoading: boolean = false;
  displayedColumns: string[] = ['capteur', 'typePanne', 'gravite', 'date', 'description', 'actions'];
  startDate = new FormControl();
  endDate = new FormControl();
  averageSatisfaction: number = 0;

  constructor(
    private alertService: AlertService,
    private toastrService: NbToastrService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getResolvedAiAlerts();
    this.getAverageSatisfaction();
  }

  getResolvedAiAlerts(): void {
    this.isLoading = true;
    this.alertService.getResolvedAIAlerts().subscribe({
      next: (alerts: Alerte[]) => {
        this.resolvedAiAlerts = [...alerts];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching resolved AI alerts:', error);
        this.toastrService.danger('Failed to fetch resolved AI alerts', 'Error');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getAverageSatisfaction(): void {
    this.alertService.getAverageSatisfactionForAIAlerts().subscribe({
      next: (avg: number) => {
        this.averageSatisfaction = avg;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching average satisfaction:', error);
        this.toastrService.danger('Failed to fetch average satisfaction', 'Error');
      },
    });
  }

  filterByDateRange(): void {
    if (!this.startDate.value || !this.endDate.value) {
      this.toastrService.warning('Please select both start and end dates', 'Warning');
      return;
    }
    const start = new Date(this.startDate.value).toISOString();
    const end = new Date(this.endDate.value).toISOString();
    this.isLoading = true;
    this.alertService.getResolvedAIAlertsByDateRange(start, end).subscribe({
      next: (alerts: Alerte[]) => {
        this.resolvedAiAlerts = [...alerts];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching filtered AI alerts:', error);
        this.toastrService.danger('Failed to fetch filtered AI alerts', 'Error');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  resetDateFilter(): void {
    this.startDate.reset();
    this.endDate.reset();
    this.getResolvedAiAlerts();
  }

  viewInterventionDetails(alerte: Alerte): void {
    this.isLoading = true;
    this.alertService.getInterventionDetailsForAlert(alerte.idAlerte).subscribe({
      next: (intervention) => {
        this.isLoading = false;
        this.dialog.open(InterventionDetailsModalComponent, {
          width: '600px',
          data: intervention,
        });
      },
      error: (error) => {
        console.error('Error fetching intervention details:', error);
        this.toastrService.danger('Failed to fetch intervention details', 'Error');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  exportToCSV(): void {
    this.isLoading = true;
    this.alertService.exportResolvedAIAlertsToCSV().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resolved-ai-alerts.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
        this.toastrService.success('CSV exported successfully', 'Success');
      },
      error: (error) => {
        console.error('Error exporting CSV:', error);
        this.toastrService.danger('Failed to export CSV', 'Error');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get alertCount(): number {
    return this.resolvedAiAlerts.length;
  }

  formatDate(dateArray: number[]): string {
    if (!dateArray || dateArray.length < 6) return '';
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second).toLocaleString();
  }
}