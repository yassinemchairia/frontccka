// src/app/Technicien/technicien-stats1/technicien-stats1.component.ts
import { Component, OnInit } from '@angular/core';
import { TechnicienStatsService, TechnicienStatsDTO, UpdateProfileRequest, Utilisateur } from '../../Service/technicien-stats.service';
import { AuthService } from '../../Service/auth.service';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-technicien-stats1',
  templateUrl: './technicien-stats1.component.html',
  styleUrls: ['./technicien-stats1.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class TechnicienStats1Component implements OnInit {
  stats: TechnicienStatsDTO | null = null;
  errorMessage: string = '';
  loading: boolean = false;
 isEditMode: boolean = false;
  profileForm: FormGroup;
  // Chart configurations
  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 14 } } },
      tooltip: { enabled: true }
    }
  };
  public prioriteChartData: ChartData<'pie'> = { labels: [], datasets: [{ data: [], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }] };
  public typeChartData: ChartData<'pie'> = { labels: [], datasets: [{ data: [], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }] };

  constructor(
    private technicienStatsService: TechnicienStatsService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {this.profileForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      numeroTelephone: ['', [Validators.pattern(/^\+?[0-9]{10,15}$/)]]
    });}

  ngOnInit(): void {
    const idUser = this.authService.getCurrentUserId();
    if (idUser) {
      this.fetchStats(idUser);
    } else {
      this.errorMessage = 'Utilisateur non connecté';
      this.router.navigate(['/auth/login']);
    }
  }

  private fetchStats(idUser: number): void {
    this.loading = true;
    this.technicienStatsService.getTechnicienStats(idUser).subscribe({
      next: (data) => {
        this.stats = data;
        this.prioriteChartData.labels = Object.keys(data.statsParPriorite);
        this.prioriteChartData.datasets[0].data = Object.values(data.statsParPriorite);
        this.typeChartData.labels = Object.keys(data.statsParType);
        this.typeChartData.datasets[0].data = Object.values(data.statsParType);
        this.profileForm.patchValue({
          nom: data.nom,
          prenom: data.prenom,
          numeroTelephone: data.numeroTelephone || ''
        });
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la récupération des statistiques';
        this.loading = false;
      }
    });
  }
toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.profileForm.reset({
        nom: this.stats?.nom,
        prenom: this.stats?.prenom,
        numeroTelephone: this.stats?.numeroTelephone || ''
      });
    }
  }

 updateProfile(): void {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Veuillez remplir correctement tous les champs requis.';
      return;
    }

    const idUser = this.authService.getCurrentUserId();
    if (!idUser) {
      this.errorMessage = 'Utilisateur non connecté';
      this.router.navigate(['/auth/login']);
      return;
    }

    const request: UpdateProfileRequest = this.profileForm.value;
    this.loading = true;
    this.technicienStatsService.updateProfile(idUser, request).subscribe({
      next: (updatedUser) => {
        if (this.stats) {
          this.stats.nom = updatedUser.nom;
          this.stats.prenom = updatedUser.prenom;
          this.stats.numeroTelephone = updatedUser.numeroTelephone;
        }
        this.isEditMode = false;
        this.loading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour du profil';
        this.loading = false;
      }
    });
  }
  navigateToInterventions(): void {
    const idUser = this.authService.getCurrentUserId();
    if (idUser) {
      this.router.navigate(['/pages/interventions', idUser]);
    }
  }
}