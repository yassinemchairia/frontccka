import { Component,OnInit } from '@angular/core';
import { TechnicienStatisticsService } from '../../Service/technicien-statistics.service';

import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-technicien-statistics',
  templateUrl: './technicien-statistics.component.html',
  styleUrls: ['./technicien-statistics.component.scss']
})
export class TechnicienStatisticsComponent implements OnInit {
  // Data from API
  interventionsByTech: any = {};
  satisfactionStats: any = {};
  availabilityStats: any = {};
  specialiteStats: any = {};
  fullStats: any[] = [];
  
  // Selected technicien for details
  selectedTech: any = null;
  
  // Chart configurations
  interventionsChartData!: ChartData<'bar'>;
  satisfactionChartData!: ChartData<'bar'>;
  availabilityChartData!: ChartData<'doughnut'>;
  specialiteChartData!: ChartData<'pie'>;
  
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

  doughnutChartOptions: ChartConfiguration['options'] = {
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

  constructor(private technicienService: TechnicienStatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  // Helper method to get object keys
  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
  // Helper method to format enum values
  formatEnum(value: string): string {
    return value.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

  // Calculate average satisfaction
  averageSatisfaction(): number {
    const values = Object.values(this.satisfactionStats) as number[];
    return values.length > 0 ? 
      values.reduce((a, b) => a + b, 0) / values.length : 
      0;
  }

  // Calculate average availability
  averageAvailability(): number {
    const values = Object.values(this.availabilityStats) as number[];
    return values.length > 0 ? 
      values.reduce((a, b) => a + b, 0) / values.length : 
      0;
  }

  loadStatistics(): void {
    this.technicienService.getInterventionsByTechnicien().subscribe(data => {
      this.interventionsByTech = data;
      this.prepareInterventionsChartData();
    });

    this.technicienService.getSatisfactionMoyenne().subscribe(data => {
      this.satisfactionStats = data;
      this.prepareSatisfactionChartData();
    });

    this.technicienService.getDisponibilite().subscribe(data => {
      this.availabilityStats = data;
      this.prepareAvailabilityChartData();
    });

    this.technicienService.getSpecialitesSollicitees().subscribe(data => {
      this.specialiteStats = data;
      this.prepareSpecialiteChartData();
    });

    this.technicienService.getFullTechniciensStats().subscribe(data => {
      this.fullStats = data;
    });
  }

  prepareInterventionsChartData(): void {
    const labels = Object.keys(this.interventionsByTech);
    this.interventionsChartData = {
      labels: labels,
      datasets: [{
        data: Object.values(this.interventionsByTech),
        backgroundColor: '#4e73df',
        borderWidth: 0
      }]
    };
  }

  prepareSatisfactionChartData(): void {
    const labels = Object.keys(this.satisfactionStats);
    this.satisfactionChartData = {
      labels: labels,
      datasets: [{
        data: Object.values(this.satisfactionStats),
        backgroundColor: '#1cc88a',
        borderWidth: 0
      }]
    };
  }

  prepareAvailabilityChartData(): void {
    const labels = Object.keys(this.availabilityStats);
    this.availabilityChartData = {
      labels: labels,
      datasets: [{
        data: Object.values(this.availabilityStats),
        backgroundColor: ['#36b9cc', '#f8f9fa'],
        hoverBackgroundColor: ['#2c9faf', '#e9ecef'],
        borderWidth: 0
      }]
    };
  }

  prepareSpecialiteChartData(): void {
    this.specialiteChartData = {
      labels: Object.keys(this.specialiteStats),
      datasets: [{
        data: Object.values(this.specialiteStats),
        backgroundColor: ['#4e73df', '#1cc88a', '#f6c23e'],
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#dda20a'],
        borderWidth: 0
      }]
    };
  }

  showTechDetails(tech: any): void {
    this.selectedTech = {
      ...tech,
      statsParPriorite: tech.statsParPriorite || {},
      statsParType: tech.statsParType || {}
    };
  }

  getSatisfactionColor(value: number): string {
    if (value >= 80) return '#1cc88a';
    if (value >= 50) return '#f6c23e';
    return '#e74a3b';
  }
}