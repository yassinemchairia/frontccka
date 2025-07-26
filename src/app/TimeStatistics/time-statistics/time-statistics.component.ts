import { Component, OnInit } from '@angular/core';
import { TimeStatisticsService } from '../../Service/time-statistics.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-time-statistics',
  templateUrl: './time-statistics.component.html',
  styleUrls: ['./time-statistics.component.scss'],
  providers: [DatePipe]
})
export class TimeStatisticsComponent implements OnInit {
  // Data from API
  alertesByPeriod: any = {};
  interventionsByPeriod: any = {};
  criticalHours: any = {};
  criticalDays: any = {};
  
  // Time period selection
  selectedPeriod: 'day' | 'month' = 'day';
  periodCount: number = 30;
  
  // Chart configurations
  alertesChartData!: ChartData<'line'>;
  interventionsChartData!: ChartData<'line'>;
  hoursChartData!: ChartData<'bar'>;
  daysChartData!: ChartData<'bar'>;
  
  lineChartOptions: ChartConfiguration['options'] = {
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

  constructor(
    private timeStatsService: TimeStatisticsService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  // Helper method to get object keys
  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  // Helper method to format day names
  formatDayName(day: string): string {
    const dayMap: {[key: string]: string} = {
      'MONDAY': 'Lundi',
      'TUESDAY': 'Mardi',
      'WEDNESDAY': 'Mercredi',
      'THURSDAY': 'Jeudi',
      'FRIDAY': 'Vendredi',
      'SATURDAY': 'Samedi',
      'SUNDAY': 'Dimanche'
    };
    return dayMap[day] || day;
  }

  loadStatistics(): void {
    const unit = this.selectedPeriod === 'day' ? 'DAYS' : 'MONTHS';
    
    // Load alertes by period
    this.timeStatsService.getAlertCountByPeriod(unit, this.periodCount).subscribe(data => {
      this.alertesByPeriod = data;
      this.prepareAlertesChartData();
    });

    // Load interventions by period
    this.timeStatsService.getInterventionCountByPeriod(unit, this.periodCount).subscribe(data => {
      this.interventionsByPeriod = data;
      this.prepareInterventionsChartData();
    });

    // Load critical hours
    this.timeStatsService.getCriticalHours().subscribe(data => {
      this.criticalHours = data;
      this.prepareHoursChartData();
    });

    // Load critical days
    this.timeStatsService.getCriticalDays().subscribe(data => {
      this.criticalDays = data;
      this.prepareDaysChartData();
    });
  }

  prepareAlertesChartData(): void {
    const labels = Object.keys(this.alertesByPeriod);
const data = Object.values(this.alertesByPeriod) as number[];
    
    this.alertesChartData = {
      labels: labels,
      datasets: [{
        data: data,
        borderColor: '#e74a3b',
        backgroundColor: 'rgba(231, 74, 59, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#e74a3b',
        pointRadius: 3,
        fill: true
      }]
    };
  }

  prepareInterventionsChartData(): void {
    const labels = Object.keys(this.interventionsByPeriod);
const data = Object.values(this.interventionsByPeriod) as number[];
    
    this.interventionsChartData = {
      labels: labels,
      datasets: [{
        data: data,
        borderColor: '#36b9cc',
        backgroundColor: 'rgba(54, 185, 204, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#36b9cc',
        pointRadius: 3,
        fill: true
      }]
    };
  }

  prepareHoursChartData(): void {
    const labels = Object.keys(this.criticalHours).map(h => `${h}h`);
const data = Object.values(this.criticalHours) as number[];
    
    this.hoursChartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: '#4e73df',
        borderWidth: 0
      }]
    };
  }

  prepareDaysChartData(): void {
    const labels = Object.keys(this.criticalDays).map(this.formatDayName);
const data = Object.values(this.criticalDays) as number[];
    
    this.daysChartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: '#f6c23e',
        borderWidth: 0
      }]
    };
  }

  onPeriodChange(): void {
    this.loadStatistics();
  }

 getTotalAlertes(): number {
  return (Object.values(this.alertesByPeriod) as number[]).reduce((a, b) => a + b, 0);
}

getTotalInterventions(): number {
  return (Object.values(this.interventionsByPeriod) as number[]).reduce((a, b) => a + b, 0);
}


  getPeakHour(): string {
    const entries = Object.entries(this.criticalHours);
    if (entries.length === 0) return '-';
    const [hour, count] = entries[0];
    return `${hour}h (${count} alertes)`;
  }

  getPeakDay(): string {
    const entries = Object.entries(this.criticalDays);
    if (entries.length === 0) return '-';
    const [day, count] = entries[0];
    return `${this.formatDayName(day)} (${count} alertes)`;
  }
}