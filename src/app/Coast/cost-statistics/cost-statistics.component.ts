import { Component, OnInit } from '@angular/core';
import { CostStatisticsService } from '../../Service/cost-statistics.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cost-statistics',
  templateUrl: './cost-statistics.component.html',
  styleUrls: ['./cost-statistics.component.scss'],
  providers: [DatePipe]
})
export class CostStatisticsComponent implements OnInit {
  // Data from API
  monthlyCosts: any = {};
  averageCostByType: any = {};
  detailedCosts: any[] = [];
  annualCosts: any = {};
  costsByTechnicien: any = {};
  detailedTechCosts: any[] = [];
  
  // Selected year for annual costs
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];
  
  // Chart configurations
  monthlyChartData!: ChartData<'bar'>;
  typeChartData!: ChartData<'bar'>;
  annualChartData!: ChartData<'line'>;
  techCostChartData!: ChartData<'bar'>;
  
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
          callback: (value) => `${value} €`
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} €`
        }
      }
    }
  };

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
          callback: (value) => `${value} €`
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} €`
        }
      }
    }
  };

  constructor(
    private costService: CostStatisticsService,
    private datePipe: DatePipe
  ) {
    // Generate years list (current year - 5 to current year)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 5; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

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

  loadStatistics(): void {
    // Load monthly costs (last 12 months)
    this.costService.getMonthlyCosts(12).subscribe(data => {
      this.monthlyCosts = data;
      this.prepareMonthlyChartData();
    });

    // Load average costs by type
    this.costService.getAverageCostByType().subscribe(data => {
      this.averageCostByType = data;
      this.prepareTypeChartData();
    });

    // Load detailed costs
    this.costService.getDetailedCostStats().subscribe(data => {
      this.detailedCosts = data;
    });

    // Load annual costs
    this.loadAnnualCosts();

    // Load costs by technicien
    this.costService.getCostByTechnicien().subscribe(data => {
      this.costsByTechnicien = data;
      this.prepareTechCostChartData();
    });

    // Load detailed technicien costs
    this.costService.getDetailedCostByTechnicien().subscribe(data => {
      this.detailedTechCosts = data;
    });
  }

  loadAnnualCosts(): void {
    this.costService.getAnnualCosts(this.selectedYear).subscribe(data => {
      this.annualCosts = data;
      this.prepareAnnualChartData();
    });
  }

  prepareMonthlyChartData(): void {
    const labels = Object.keys(this.monthlyCosts);
    this.monthlyChartData = {
      labels: labels,
      datasets: [{
        data: Object.values(this.monthlyCosts),
        backgroundColor: '#4e73df',
        borderWidth: 0
      }]
    };
  }

  prepareTypeChartData(): void {
    this.typeChartData = {
      labels: Object.keys(this.averageCostByType).map(key => this.formatEnum(key)),
      datasets: [{
        data: Object.values(this.averageCostByType),
        backgroundColor: '#1cc88a',
        borderWidth: 0
      }]
    };
  }

  prepareAnnualChartData(): void {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = monthNames.map((name, index) => 
      `${name} ${this.selectedYear}`
    );
    
    const data = monthNames.map((_, index) => 
      this.annualCosts[index + 1] || 0
    );

    this.annualChartData = {
      labels: labels,
      datasets: [{
        data: data,
        borderColor: '#e74a3b',
        backgroundColor: 'rgba(231, 74, 59, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#e74a3b',
        pointRadius: 4,
        fill: true
      }]
    };
  }

  prepareTechCostChartData(): void {
    const labels = Object.keys(this.costsByTechnicien);
    this.techCostChartData = {
      labels: labels,
      datasets: [{
        data: Object.values(this.costsByTechnicien),
        backgroundColor: '#f6c23e',
        borderWidth: 0
      }]
    };
  }

  onYearChange(): void {
    this.loadAnnualCosts();
  }

  getTotalCost(): number {
  const values = Object.values(this.monthlyCosts) as number[];
  return values.reduce((a, b) => a + b, 0);
}


  getAverageCost(): number {
    const values = Object.values(this.monthlyCosts) as number[];
    return values.length > 0 ? 
      values.reduce((a, b) => a + b, 0) / values.length : 
      0;
  }
}