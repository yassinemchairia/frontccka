import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../Service/auth.service';
import { RapportService } from '../../Service/rapport.service';
import { RapportIntervention } from '../../Service/R.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'ngx-rapport-technicien',
  templateUrl: './rapport-technicien.component.html',
  styleUrls: ['./rapport-technicien.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RapportTechnicienComponent implements OnInit, OnDestroy {
  rapports: RapportIntervention[] = [];
  userId: number | null = null;
  message: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private rapportService: RapportService
  ) {}

  ngOnInit(): void {
    this.authService.currentUserId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userId => {
        this.userId = userId;
        if (this.userId) {
          this.loadRapports();
        } else {
          this.message = 'Utilisateur non connecté. Veuillez vous connecter.';
        }
      });
  }

  loadRapports(): void {
    if (!this.userId) {
      this.message = 'Utilisateur non connecté.';
      return;
    }

    this.rapportService.getRapportsByUserId(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rapports) => {
          this.rapports = rapports;
          this.message = rapports.length === 0 ? 'Aucun rapport trouvé pour cet utilisateur.' : '';
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des rapports', err);
          this.message = 'Erreur lors du chargement des rapports.';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}