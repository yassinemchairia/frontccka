import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InterventionService } from '../../Service/intervention.service';
import { InterventionDTO } from '../../Service/InterventionDTO.model';

@Component({
  selector: 'ngx-interventions-technicien',
  templateUrl: './interventions-technicien.component.html',
  styleUrls: ['./interventions-technicien.component.scss']
})
export class InterventionsTechnicienComponent implements OnInit {
  interventions: InterventionDTO[] = [];
  idTechnicien!: number;
  isLoaded = false;

  constructor(
    private interventionService: InterventionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idTechnicien = +params['id'];
      this.loadInterventions();
    });
  }

  loadInterventions(): void {
    this.interventionService.getInterventionByTechnicienId(this.idTechnicien)
      .subscribe(data => {
        this.interventions = data;
      });
  }

  // Méthode pour vérifier s'il y a des interventions en cours (pour afficher la colonne Actions)
  hasInterventionsEnCours(): boolean {
    return this.interventions.some(intervention => intervention.statut === 'EN_COURS');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 100);
  }
}