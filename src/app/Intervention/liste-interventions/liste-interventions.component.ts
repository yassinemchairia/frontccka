import { Component , OnInit } from '@angular/core';
import { InterventionService } from '../../Service/intervention.service';
import { InterventionDTO } from '../../Service/InterventionDTO.model';
import { TechnicienDTO } from '../../Service/technicien-dto.model'; // adapte le chemin si besoin
import { Router } from '@angular/router'; // Ajoutez cette importation

@Component({
  selector: 'ngx-liste-interventions',
  templateUrl: './liste-interventions.component.html',
  styleUrls: ['./liste-interventions.component.scss']
})
export class ListeInterventionsComponent implements OnInit {
  interventions: InterventionDTO[] = [];
techniciensAffectes: { [idInterv: number]: TechnicienDTO[] } = {};

  constructor(private interventionService: InterventionService,    private router: Router // Ajoutez ceci
) {}

  ngOnInit(): void {
    this.interventionService.getAllInterventions().subscribe(data => {
      this.interventions = data;
      console.log('Interventions chargées :', data);
    });
  }
  showTechniciens( idInterv: number): void {
  this.interventionService.getTechniciensAffectes( idInterv).subscribe(data => {
    this.techniciensAffectes[ idInterv] = data;
    console.log(`Techniciens pour l'intervention ${ idInterv} :`, data);
  });
}
navigateToTechnicienStats(technicienId: number): void {
    this.router.navigate(['auth/technicien-stats/', technicienId]);
  }
}