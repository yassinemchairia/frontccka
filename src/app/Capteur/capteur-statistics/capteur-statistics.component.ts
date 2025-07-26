import { Component, OnInit } from '@angular/core';
import { CapteurStatisticsService } from '../../Service/capteur-statistics.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-capteur-statistics',
  templateUrl: './capteur-statistics.component.html',
  styleUrls: ['./capteur-statistics.component.scss'],
  providers: [DatePipe]
})
export class CapteurStatisticsComponent implements OnInit {
  alertesByCapteur: { [key: string]: number } = {};
  capteursByType: any = {};
  activeCapteurs: any = {};
  fullStats: any[] = [];
  
  startDate: string | null = null;
  endDate: string | null = null;
  
  alertesChartData!: ChartData<'bar'>;
  typesChartData!: ChartData<'pie'>;
  activeCapteursChartData!: ChartData<'bar'>;
  
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  pieChartOptions: ChartConfiguration['options'] = {
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
    }
  };

  constructor(
    private capteurService: CapteurStatisticsService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  formatEnum(value: string): string {
    return value.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

  loadStatistics(): void {
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;

    if (start && end) {
      this.capteurService.getFullCapteursStatsBetweenDates(start, end).subscribe(data => {
        this.fullStats = data;
      });
    } else {
      this.capteurService.getFullCapteursStats().subscribe(data => {
        this.fullStats = data;
      });
    }

    this.capteurService.getAlertesByCapteur().subscribe(data => {
      this.alertesByCapteur = data;
      this.prepareAlertesChartData();
    });

    this.capteurService.getRepartitionByType().subscribe(data => {
      this.capteursByType = data;
      this.prepareTypesChartData();
    });

    this.capteurService.getMostActiveCapteurs(5).subscribe(data => {
      this.activeCapteurs = data;
      this.prepareActiveCapteursChartData();
    });
  }

  prepareAlertesChartData(): void {
    const labels = Object.keys(this.alertesByCapteur);
    this.alertesChartData = {
      labels: labels,
      datasets: [{
        data: Object.values(this.alertesByCapteur),
        backgroundColor: '#4e73df',
        borderWidth: 0
      }]
    };
  }

  prepareTypesChartData(): void {
    this.typesChartData = {
      labels: Object.keys(this.capteursByType).map(key => this.formatEnum(key)),
      datasets: [{
        data: Object.values(this.capteursByType),
        backgroundColor: ['#4e73df', '#1cc88a', '#f6c23e'],
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#dda20a'],
        borderWidth: 0
      }]
    };
  }

  prepareActiveCapteursChartData(): void {
    const labels = Object.keys(this.activeCapteurs);
    this.activeCapteursChartData = {
      labels: labels,
      datasets: [{
        data: Object.values(this.activeCapteurs),
        backgroundColor: '#e74a3b',
        borderWidth: 0
      }]
    };
  }

  onDateChange(): void {
    this.loadStatistics();
  }

  resetDates(): void {
    this.startDate = null;
    this.endDate = null;
    this.loadStatistics();
  }

  getAlertColor(count: number): string {
    if (count > 50) return '#e74a3b';
    if (count > 20) return '#f6c23e';
    return '#1cc88a';
  }

  getTotalAlertes(): number {
    return Object.values(this.alertesByCapteur).reduce((a: number, b: number) => a + b, 0);
  }

  displayedColumns: string[] = ['emplacement', 'ip', 'type', 'alertes'];
}