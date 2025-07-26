import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoriqueService } from '../../Service/historique.service';

@Component({
  selector: 'ngx-ajout-historique',
  templateUrl: './ajout-historique.component.html',
  styleUrls: ['./ajout-historique.component.scss']
})
export class AjoutHistoriqueComponent {
  description: string = '';
  interventionId!: number;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private historiqueService: HistoriqueService
  ) {}

  ngOnInit(): void {
    this.interventionId = +this.route.snapshot.paramMap.get('id')!;
  }

  ajouterHistorique(): void {
    if (this.description.trim()) {
      this.historiqueService.ajouterHistorique(this.interventionId, this.description)
        .subscribe({
          next: (res) => this.message = res,
          error: () => this.message = 'Erreur lors de l\'ajout de l\'historique.'
        });
    } else {
      this.message = 'Veuillez entrer une description.';
    }
  }
}