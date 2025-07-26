import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InterventionService } from '../../Service/intervention.service';
import { InterventionDTO } from '../../Service/InterventionDTO.model';
import { HistoriqueIntervention, HistoriqueInterventionDTO, Statut } from '../../Service/historique-intervention.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-intervention-technicien',
  templateUrl: './intervention-technicien.component.html',
  styleUrls: ['./intervention-technicien.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out'))
    ])
  ]
})
export class InterventionTechnicienComponent implements OnInit, OnDestroy {
  interventions: InterventionDTO[] = [];
  historiques: { [key: number]: HistoriqueIntervention[] } = {};
  technicienId: number;
  searchTerm: string = '';
  searchResults: HistoriqueIntervention[] = [];
  message: string = '';
  newHistorique: HistoriqueInterventionDTO = {
    interventionId: 0,
    description: '',
    rapport: '',
    statut: Statut.EN_COURS
  };

  newRapport: { details: string; coutIntervention: number; satisfaction: number } = {
    details: '',
    coutIntervention: 0,
    satisfaction: 1
  };
  showForm: { [key: number]: boolean } = {};
  showAddForm: { [key: number]: boolean } = {};
  showRapportForm: { [key: number]: boolean } = {};
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private interventionService: InterventionService
  ) {
    this.technicienId = Number(this.route.snapshot.paramMap.get('idTechnicien'));
  }

  ngOnInit(): void {
    this.loadInterventions();
  }

  loadInterventions(): void {
    this.interventionService.getInterventionsByTechnicienId(this.technicienId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.interventions = data;
          this.message = data.length === 0 ? 'Aucune intervention trouvée pour ce technicien.' : '';
          this.interventions.forEach(intervention => {
            this.loadHistoriques(intervention.idInterv);
            this.showForm[intervention.idInterv] = false;
            this.showAddForm[intervention.idInterv] = false;
          });
        },
        error: (err) => {
          console.error('Erreur récupération interventions', err);
          this.message = 'Erreur lors du chargement des interventions.';
        }
      });
  }

  loadHistoriques(idInterv: number): void { this.interventionService.getHistoriquesParIntervention(idInterv) .pipe(takeUntil(this.destroy$)) .subscribe({ next: (historiques) => { this.historiques[idInterv] = historiques; }, error: (err) => { console.error(`Erreur récupération historiques pour intervention ${idInterv}`, err); } }); }

  private parseDateAction(dateAction: string): Date {
    try {
      if (!dateAction || !dateAction.includes(',')) {
        console.warn(`Invalid dateAction format: ${dateAction}, returning current date`);
        return new Date();
      }
      const [year, month, day, hour, minute, second] = dateAction.split(',').map(Number);
      if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute) || isNaN(second)) {
        console.warn(`Invalid date components in ${dateAction}, returning current date`);
        return new Date();
      }
      return new Date(year, month - 1, day, hour, minute, second);
    } catch (error) {
      console.error(`Error parsing dateAction: ${dateAction}`, error);
      return new Date();
    }
  }

  toggleHistorique(idInterv: number): void {
    this.showForm[idInterv] = !this.showForm[idInterv];
    if (!this.showForm[idInterv]) {
      this.showAddForm[idInterv] = false; // Hide form when collapsing historique section
    }
  }

  toggleAddHistoriqueForm(idInterv: number): void {
    this.showAddForm[idInterv] = !this.showAddForm[idInterv];
    if (!this.showAddForm[idInterv]) {
      this.resetForm(); // Reset form when hiding
    }
  }
toggleRapportForm(idInterv: number): void {
    this.showRapportForm[idInterv] = !this.showRapportForm[idInterv]; // Toggle the form visibility
    if (!this.showRapportForm[idInterv]) {
      this.resetRapportForm();
    }
  }
   ajouterRapport(idInterv: number): void {
    this.interventionService.ajouterRapport(idInterv, this.newRapport)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadInterventions(); // Refresh interventions to update statut and dateFin
          this.resetRapportForm();
          this.showRapportForm[idInterv] = false;
        },
        error: (err) => {
          console.error('Erreur ajout rapport', err);
          this.message = 'Erreur lors de l’ajout du rapport.';
        }
      });
  }
 resetRapportForm(): void {
    this.newRapport = {
      details: '',
      coutIntervention: 0,
      satisfaction: 1
    };
  }
  ajouterHistorique(idInterv: number): void {
    this.newHistorique.interventionId = idInterv;
    this.interventionService.ajouterHistorique(this.newHistorique)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadHistoriques(idInterv);
          this.resetForm();
          this.showAddForm[idInterv] = false;
        },
        error: (err) => {
          console.error('Erreur ajout historique', err);
          this.message = 'Erreur lors de l’ajout de l’historique.';
        }
      });
  }

  searchHistoriques(): void {
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      this.message = 'Veuillez entrer un terme de recherche.';
      return;
    }
    this.interventionService.searchHistoriques(this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.searchResults = results;
          this.message = results.length === 0 ? 'Aucun historique trouvé pour ce terme.' : '';
        },
        error: (err) => {
          console.error('Erreur recherche historiques', err);
          this.message = 'Erreur lors de la recherche des historiques.';
        }
      });
  }


  resetForm(): void {
    this.newHistorique = {
      interventionId: 0,
      description: '',
      rapport: '',
      statut: Statut.EN_COURS
    };
  }

  viewInCalendar(): void {
    this.router.navigate(['/auth/interventions', this.technicienId]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}