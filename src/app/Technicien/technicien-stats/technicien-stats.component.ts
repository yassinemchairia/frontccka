import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TechnicienStatsService, TechnicienStatsDTO } from '../../Service/technicien-stats.service';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'ngx-technicien-stats',
  templateUrl: './technicien-stats.component.html',
  styleUrls: ['./technicien-stats.component.scss']
})
export class TechnicienStatsComponent implements OnInit {

  technicienStats: TechnicienStatsDTO | null = null;
  technicienId: number | null = null;
  isLoading = true;

  barChartType: ChartType = 'bar';

  globalChartLabels: string[] = ['Interventions', 'Durée totale', 'Durée moyenne', 'Taux de réussite'];
  globalChartData: any[] = [];

  prioriteChartLabels: string[] = [];
  prioriteChartData: any[] = [];

  typeChartLabels: string[] = [];
  typeChartData: any[] = [];

  globalChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Statistiques globales' }
    }
  };

  prioriteChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Interventions par priorité' }
    }
  };

  typeChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Interventions par type' }
    }
  };

  constructor(
    private route: ActivatedRoute,
    private statsService: TechnicienStatsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.technicienId = +id;
        this.fetchTechnicienStats(this.technicienId);
      }
    });
  }

  fetchTechnicienStats(id: number): void {
    this.statsService.getTechnicienStats(id).subscribe({
      next: (stats) => {
        this.technicienStats = stats;

        this.globalChartData = [{
          data: [
            stats.nbInterventions,
            parseFloat(stats.dureeTotale),
            parseFloat(stats.dureeMoyenne),
            parseFloat(stats.tauxReussite)
          ],
          label: 'Valeurs globales',
          backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#9b59b6']
        }];

        this.prioriteChartLabels = Object.keys(stats.statsParPriorite);
        this.prioriteChartData = [{
          data: Object.values(stats.statsParPriorite),
          label: 'Par priorité',
          backgroundColor: ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db']
        }];

        this.typeChartLabels = Object.keys(stats.statsParType);
        this.typeChartData = [{
          data: Object.values(stats.statsParType),
          label: 'Par type',
          backgroundColor: ['#8e44ad', '#e67e22', '#1abc9c', '#34495e']
        }];

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching stats:', err);
        this.isLoading = false;
      }
    });
  }
}
