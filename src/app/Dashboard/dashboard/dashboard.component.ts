import { Component, OnInit } from '@angular/core';
import { KpiService } from '../../Service/kpi.service';
import { Observable, forkJoin } from 'rxjs';
@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
   resolutionRate: number = 0;
  averageCost: number = 0;
  globalSatisfaction: number = 0;
  preventiveCorrectiveRatio: number = 0;

  constructor(private dashboardService: KpiService) {}

  ngOnInit(): void {
    forkJoin({
      resolutionRate: this.dashboardService.getResolutionRate(),
      averageCost: this.dashboardService.getAverageCost(),
      satisfaction: this.dashboardService.getGlobalSatisfaction(),
      preventiveStats: this.dashboardService.getPreventiveStats()
    }).subscribe({
      next: ({ resolutionRate, averageCost, satisfaction, preventiveStats }) => {
        this.resolutionRate = resolutionRate;
        this.averageCost = averageCost;
        this.globalSatisfaction = satisfaction;
        const totalPreventive = preventiveStats.totalInterventionsPreventives;
        const totalInterventions = this.calculateTotalInterventions(preventiveStats);
        this.preventiveCorrectiveRatio = totalInterventions > 0 ? totalPreventive / (totalInterventions - totalPreventive) : 0;
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    });
  }

  private calculateTotalInterventions(stats: any): number {
    // Assuming backend can be extended to provide total interventions
    // For now, we'll use a placeholder calculation
    return stats.totalInterventionsPreventives * 2; // Simplified assumption
  }
}