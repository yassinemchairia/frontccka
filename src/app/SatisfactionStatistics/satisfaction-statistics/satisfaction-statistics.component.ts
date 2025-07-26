import { Component, OnInit } from '@angular/core';
import { SatisfactionStatisticsService } from '../../Service/satisfaction-statistics.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-satisfaction-statistics',
  templateUrl: './satisfaction-statistics.component.html',
  styleUrls: ['./satisfaction-statistics.component.scss']
})
export class SatisfactionStatisticsComponent implements OnInit {
  // Data from API
  globalAverage: number = 0;
  satisfactionTrend: any = {};
 satisfactionByType: Record<string, number> = {};
satisfactionDistribution: Record<number, number> = {};

  // Chart configurations
  trendChartData!: ChartData<'line'>;
  typeChartData!: ChartData<'bar'>;
  distributionChartData!: ChartData<'bar'>;
  
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y.toFixed(1)}/10`
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
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  constructor(private satisfactionService: SatisfactionStatisticsService) {}

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
    // Load global average
    this.satisfactionService.getGlobalAverageSatisfaction().subscribe(data => {
      this.globalAverage = data;
    });

    // Load satisfaction trend (last 6 months)
    this.satisfactionService.getSatisfactionTrend(6).subscribe(data => {
      this.satisfactionTrend = data;
      this.prepareTrendChartData();
    });

    // Load satisfaction by type
    this.satisfactionService.getAverageSatisfactionByType().subscribe(data => {
      this.satisfactionByType = data;
      this.prepareTypeChartData();
    });

    // Load satisfaction distribution
    this.satisfactionService.getSatisfactionDistribution().subscribe(data => {
      this.satisfactionDistribution = data;
      this.prepareDistributionChartData();
    });
  }

  prepareTrendChartData(): void {
    const labels = Object.keys(this.satisfactionTrend);
    this.trendChartData = {
      labels: labels,
      datasets: [{
        data: Object.values(this.satisfactionTrend),
        borderColor: '#4e73df',
        backgroundColor: 'rgba(78, 115, 223, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#4e73df',
        pointRadius: 4,
        fill: true
      }]
    };
  }

  prepareTypeChartData(): void {
    this.typeChartData = {
      labels: Object.keys(this.satisfactionByType).map(key => this.formatEnum(key)),
      datasets: [{
        data: Object.values(this.satisfactionByType),
        backgroundColor: '#1cc88a',
        borderWidth: 0
      }]
    };
  }

  prepareDistributionChartData(): void {
    const labels = Object.keys(this.satisfactionDistribution).map(n => `${n}/10`);
    this.distributionChartData = {
      labels: labels,
      datasets: [{
        data: Object.values(this.satisfactionDistribution),
        backgroundColor: '#f6c23e',
        borderWidth: 0
      }]
    };
  }

  getSatisfactionColor(score: number): string {
    if (score >= 8) return '#1cc88a'; // Green
    if (score >= 5) return '#f6c23e'; // Yellow
    return '#e74a3b'; // Red
  }

  getSatisfactionLevel(score: number): string {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Bon';
    if (score >= 4) return 'Moyen';
    return 'Faible';
  }
  // Ajoutez ces méthodes à la classe SatisfactionStatisticsComponent

getTrendChange(): number {
  const values = Object.values(this.satisfactionTrend) as number[];
  if (values.length < 2) return 0;
  
  const last = values[values.length - 1];
  const prev = values[values.length - 2];
  return ((last - prev) / prev) * 100;
}

getBestType(): { type: string, score: number } | null {
  if (!this.satisfactionByType || Object.keys(this.satisfactionByType).length === 0) {
    return null;
  }

  let maxScore = 0;
  let bestType = '';

  for (const [type, score] of Object.entries(this.satisfactionByType)) {
    const numericScore = Number(score); // Cast explicite
    if (!isNaN(numericScore) && numericScore > maxScore) {
      maxScore = numericScore;
      bestType = this.formatEnum(type);
    }
  }

  return { type: bestType, score: maxScore };
}


getPercentage(score: number): number {
  const values = Object.values(this.satisfactionDistribution)
    .map(v => Number(v)) // Cast en number
    .filter(v => !isNaN(v)); // Supprimer les NaN

  const total = values.reduce((a, b) => a + b, 0);

  return total === 0 ? 0 : ((this.satisfactionDistribution[score] || 0) / total) * 100;
}

}