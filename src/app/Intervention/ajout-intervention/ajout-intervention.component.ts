import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Intervention } from '../../Service/intervention.model';
import { InterventionService } from '../../Service/intervention.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ajout-intervention',
  templateUrl: './ajout-intervention.component.html',
  styleUrls: ['./ajout-intervention.component.scss']
})
export class AjoutInterventionComponent implements OnInit {
  intervention: Intervention = {
    dateDebut: '',
    priorite: 'MOYENNE',
    typeIntervention: 'CORRECTIVE',
    alerte: { idAlerte: 0 },
    techniciens: []
  };

  techniciens: any[] = [];
  techniciensIA: any[] = [];
  modeSelection: 'manuel' | 'ia' = 'manuel';
  specialite: string = '';
  nomTechnicienIA: string = '';
  dureeEstimee: number = 3; // Valeur par défaut

  constructor(
    private interventionService: InterventionService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerTechniciens();
    const idAlerte = this.route.snapshot.queryParamMap.get('idAlerte');
    if (idAlerte) {
      this.intervention.alerte.idAlerte = +idAlerte;
    }
  }

  chargerTechniciens(): void {
    this.http.get<any[]>(`${this.interventionService['apiUrl1']}/alertes/techniciens`)
      .subscribe({
        next: (data) => {
          this.techniciens = data;
          console.log('Techniciens chargés:', this.techniciens); // Debug
        },
        error: (err) => {
          console.error('Erreur lors du chargement des techniciens:', err);
          alert('Erreur lors du chargement des techniciens. Veuillez réessayer.');
        }
      });
  }

  onTechnicienChange(event: any): void {
    const id = +event.target.value;
    if (event.target.checked) {
      if (this.intervention.techniciens.length >= 3) {
        alert('Vous ne pouvez pas sélectionner plus de 3 techniciens.');
        event.target.checked = false;
        return;
      }
      this.intervention.techniciens.push({ idUser: id });
    } else {
      this.intervention.techniciens = this.intervention.techniciens.filter(t => t.idUser !== id);
    }
  }

  utiliserIA(): void {
    const dateDebut = this.intervention.dateDebut ? this.intervention.dateDebut + ':00' : new Date().toISOString();
    const predictionData = {
      dateDebut,
      specialite: this.specialite,
      typeIntervention: this.intervention.typeIntervention,
      priorite: this.intervention.priorite,
      dureeEstimee: this.dureeEstimee
    };

    this.interventionService.predictTechnicians(predictionData).subscribe({
      next: (response: { status: string; techniciens: number[]; probabilites: number[] }) => {
        if (response.status === 'success') {
          this.techniciensIA = response.techniciens.map((id, index) => ({
            idUser: id,
            probabilite: response.probabilites[index],
            ...this.techniciens.find(t => t.idUser === id) // Ajoute nom et spécialité
          })).filter(t => t.nom); // Filtre les techniciens valides
          const noms = this.techniciensIA.map(t => `${t.nom} (Prob: ${(t.probabilite * 100).toFixed(2)}%)`).join(', ');
          this.nomTechnicienIA = noms || 'Aucun trouvé';
        } else {
          alert('Erreur dans la prédiction: ' + response.status);
        }
      },
      error: err => alert('Erreur IA : ' + err.message)
    });
  }

  onSubmit(): void {
    if (this.intervention.techniciens.length === 0) {
      alert('Aucun technicien sélectionné.');
      return;
    }
    const payload = {
      idAlerte: this.intervention.alerte.idAlerte,
      technicienIds: this.intervention.techniciens.map(t => t.idUser),
      dateDebut: this.intervention.dateDebut,
      priorite: this.intervention.priorite,
      typeIntervention: this.intervention.typeIntervention
    };
    console.log('Submitting payload:', payload); // Debug payload
    this.interventionService.ajouterIntervention(payload).subscribe({
      next: () => {
        alert('Intervention ajoutée avec succès !');
        this.router.navigate(['/pages/alertes']);
      },
      error: err => {
        console.error('Error details:', err);
        const errorMessage = err.status === 400
          ? (err.error || 'Données invalides. Vérifiez les champs saisis.')
          : 'Une erreur inconnue est survenue.';
        alert(`Erreur : ${errorMessage}`);
      }
    });
  }

  ouvrirStats(id: number): void {
    this.router.navigate([`/auth/technicien-stats/${id}`]);
  }

  onModeSelectionChange(): void {
    // Réinitialiser les techniciens IA si le mode change
    if (this.modeSelection === 'manuel') {
      this.techniciensIA = [];
      this.nomTechnicienIA = '';
    }
  }
}
