import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RapportService } from '../../Service/rapport.service';
import { Rapport } from '../../Service/rapport.model';@Component({
  selector: 'ngx-ajout-rapport',
  templateUrl: './ajout-rapport.component.html',
  styleUrls: ['./ajout-rapport.component.scss']
})
export class AjoutRapportComponent implements OnInit {
  rapportForm: FormGroup;
  interventionId: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rapportService: RapportService
  ) {
    this.rapportForm = this.fb.group({
      details: ['', [Validators.required, Validators.minLength(10)]],
      coutIntervention: [0, [Validators.required, Validators.min(0)]],
      satisfaction: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    this.interventionId = +this.route.snapshot.params['id'];
  }

  onSubmit(): void {
    if (this.rapportForm.valid) {
      const rapport: Rapport = {
        ...this.rapportForm.value,
        interventionId: this.interventionId
      };

      this.rapportService.ajouterRapport(this.interventionId, rapport).subscribe({
        next: () => {
          alert('Rapport ajouté avec succès !');
          //this.router.navigate(['/interventions']);
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'ajout du rapport');
        }
      });
    }
  }
}