import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../Service/alert.service';

interface TypePanneCount {
  ELECTRICITE: number;
  CLIMATISATION: number;
  ENVIRONNEMENT: number;
}

interface NiveauGraviteCount {
  NORMALE: number;
  CRITIQUE: number;
  HIGH_CRITICAL: number;
}

@Component({
  selector: 'app-alert-statistics',
  templateUrl: './alert-statistics.component.html',
  styleUrls: ['./alert-statistics.component.scss']
})
export class AlertStatisticsComponent implements OnInit {
  typePanneStats: TypePanneCount = { ELECTRICITE: 0, CLIMATISATION: 0, ENVIRONNEMENT: 0 };
  graviteStats: NiveauGraviteCount = { NORMALE: 0, CRITIQUE: 0, HIGH_CRITICAL: 0 };
  averageResolutionTime: number = 0;
  resolutionRate: number = 0;
  
  // Données pour les graphiques
  typePanneChartData: any;
  graviteChartData: any;
  chartOptions: any;

  constructor(private alerteService: AlertService) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.initChartOptions();
  }

  loadStatistics(): void {
    this.alerteService.getAlertByType().subscribe(data => {
      this.typePanneStats = data;
      this.prepareTypePanneChartData();
    });

    this.alerteService.getAlertesByGravite().subscribe(data => {
      this.graviteStats = data;
      this.prepareGraviteChartData();
    });

    this.alerteService.getAverageResolutionTime().subscribe(data => {
      this.averageResolutionTime = data;
    });

    this.alerteService.getResolutionRate().subscribe(data => {
      this.resolutionRate = data;
    });
  }

  initChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        }
      },
      cutout: '70%'
    };
  }

  prepareTypePanneChartData(): void {
    this.typePanneChartData = {
      labels: ['Électricité', 'Climatisation', 'Environnement'],
      datasets: [{
        data: [this.typePanneStats.ELECTRICITE, this.typePanneStats.CLIMATISATION, this.typePanneStats.ENVIRONNEMENT],
        backgroundColor: [
          '#4e73df',
          '#1cc88a',
          '#36b9cc'
        ],
        hoverBackgroundColor: [
          '#2e59d9',
          '#17a673',
          '#2c9faf'
        ],
        borderWidth: 0
      }]
    };
  }

  prepareGraviteChartData(): void {
    this.graviteChartData = {
      labels: ['Normale', 'Critique', 'Très Critique'],
      datasets: [{
        data: [this.graviteStats.NORMALE, this.graviteStats.CRITIQUE, this.graviteStats.HIGH_CRITICAL],
        backgroundColor: [
          '#f6c23e',
          '#e74a3b',
          '#be2617'
        ],
        hoverBackgroundColor: [
          '#dda20a',
          '#be2617',
          '#8a1c0f'
        ],
        borderWidth: 0
      }]
    };
  }

  getResolutionRateColor(): string {
    if (this.resolutionRate >= 80) return '#1cc88a';
    if (this.resolutionRate >= 50) return '#f6c23e';
    return '#e74a3b';
  }

  getAverageTimeColor(): string {
    if (this.averageResolutionTime < 2) return '#1cc88a';
    if (this.averageResolutionTime < 5) return '#f6c23e';
    return '#e74a3b';
  }
}