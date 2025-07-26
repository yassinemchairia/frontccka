import { Component, OnInit } from '@angular/core';
import { InterventionService } from '../../Service/intervention.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-intervention-statistics',
  templateUrl: './intervention-statistics.component.html',
  styleUrls: ['./intervention-statistics.component.scss'],
  providers: [DatePipe]
})
export class InterventionStatisticsComponent implements OnInit {
  typeStats: {[key: string]: number} = {};
  statusStats: {[key: string]: number} = {};
  priorityStats: {[key: string]: number} = {};
  averageDuration: number = 0;
  
  startDate: string | null = null;
  endDate: string | null = null;
  
  typeChartData!: ChartData<'doughnut'>;
  statusChartData!: ChartData<'doughnut'>;
  priorityChartData!: ChartData<'bar'>;
  
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
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
    private interventionService: InterventionService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  loadStatistics(): void {
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;
    
    this.interventionService.getInterventionsByType(start, end).subscribe(data => {
      this.typeStats = data;
      this.prepareTypeChartData();
    });

    this.interventionService.getInterventionsByStatus().subscribe(data => {
      this.statusStats = data;
      this.prepareStatusChartData();
    });

    this.interventionService.getAverageInterventionDuration().subscribe(data => {
      this.averageDuration = data;
    });

    this.interventionService.getInterventionsByPriority().subscribe(data => {
      this.priorityStats = data;
      this.preparePriorityChartData();
    });
  }

  prepareTypeChartData(): void {
    this.typeChartData = {
      labels: Object.keys(this.typeStats).map(key => this.formatEnum(key)),
      datasets: [{
        data: Object.values(this.typeStats),
        backgroundColor: ['#4e73df', '#1cc88a'],
        hoverBackgroundColor: ['#2e59d9', '#17a673'],
        borderWidth: 0
      }]
    };
  }

  prepareStatusChartData(): void {
    this.statusChartData = {
      labels: Object.keys(this.statusStats).map(key => this.formatEnum(key)),
      datasets: [{
        data: Object.values(this.statusStats),
        backgroundColor: ['#f6c23e', '#36b9cc'],
        hoverBackgroundColor: ['#dda20a', '#2c9faf'],
        borderWidth: 0
      }]
    };
  }

  preparePriorityChartData(): void {
    this.priorityChartData = {
      labels: Object.keys(this.priorityStats).map(key => this.formatEnum(key)),
      datasets: [{
        data: Object.values(this.priorityStats),
        backgroundColor: ['#e74a3b', '#f6c23e', '#1cc88a'],
        borderWidth: 0
      }]
    };
  }

  formatEnum(value: string): string {
    return value.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

  onDateChange(): void {
    this.loadStatistics();
  }

  resetDates(): void {
    this.startDate = null;
    this.endDate = null;
    this.loadStatistics();
  }

  getDurationColor(): string {
    if (this.averageDuration < 2) return '#1cc88a';
    if (this.averageDuration < 5) return '#f6c23e';
    return '#e74a3b';
  }

  getTotalInterventions(): number {
    return Object.values(this.typeStats).reduce((a, b) => a + b, 0);
  }
}