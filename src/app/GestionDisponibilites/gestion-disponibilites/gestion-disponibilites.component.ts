import { Component, OnInit } from '@angular/core';

import { CalendrierDisponibiliteServiceService } from '../../Service/calendrier-disponibilite-service.service';

import { AuthService } from '../../Service/auth.service';

import { CalendrierDisponibilite } from '../../Service/CalendrierDisponibilite';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { of } from 'rxjs';



@Component({

selector: 'ngx-gestion-disponibilites',

 templateUrl: './gestion-disponibilites.component.html',

 styleUrls: ['./gestion-disponibilites.component.scss']

})

export class GestionDisponibilitesComponent implements OnInit {

 currentUserId: number | null = null;

 isAdmin: boolean = false;

technicienId: number | null = null;



 // Data for current availabilities section

 allDisponibilites: CalendrierDisponibilite[] = [];

filteredDisponibilites: CalendrierDisponibilite[] = [];
 paginatedDisponibilites: CalendrierDisponibilite[] = []; // New: For current page display

 filterStatus: 'all' | 'disponible' | 'non-disponible' = 'all';



  // Pagination properties

 currentPage: number = 1;

 itemsPerPage: number = 5; // You can adjust this number

 totalPages: number = 0;



// Data for non-available days section
 nonDisponibilitesSearchResults: CalendrierDisponibilite[] = [];



 // Forms
 modifierForm: FormGroup;

  supprimerForm: FormGroup;

  masseForm: FormGroup;

  nonDisponiblesForm: FormGroup;

  singleDisponibiliteForm: FormGroup;



  // UI state for showing/hiding forms

  showAddSingleForm: boolean = true;

  selectedAvailabilityToModify: CalendrierDisponibilite | null = null;

  selectedAvailabilityToDelete: CalendrierDisponibilite | null = null;





  constructor(

    private calendrierService: CalendrierDisponibiliteServiceService,

    private authService: AuthService,

    private fb: FormBuilder

  ) {

    // Initialize forms

    this.modifierForm = this.fb.group({

      date: ['', Validators.required],

      disponible: [false]

    });

    this.supprimerForm = this.fb.group({

      date: ['', Validators.required]

    });

    this.masseForm = this.fb.group({

      dateDebut: ['', Validators.required],

      dateFin: ['', Validators.required],

      disponible: [false]

    });

    this.nonDisponiblesForm = this.fb.group({

      dateDebut: ['', Validators.required],

      dateFin: ['', Validators.required]

    });

    this.singleDisponibiliteForm = this.fb.group({

      date: ['', Validators.required],

      disponible: [false]

    });

  }



  ngOnInit(): void {

    this.authService.currentUserId$.subscribe(id => {

      this.currentUserId = id;

      this.technicienId = id;

      if (this.technicienId && !this.isAdmin) {

        this.loadDisponibilites(this.technicienId);

      }

    });

    this.authService.currentUserRole$.subscribe(role => {

      this.isAdmin = role === 'ADMIN';

      if (this.technicienId && !this.isAdmin) {

        this.loadDisponibilites(this.technicienId);

      }

    });

  }



  loadDisponibilites(technicienId: number): void {

    this.calendrierService.getDisponibilitesTechnicien(technicienId).subscribe({

      next: (disponibilites) => {

        this.allDisponibilites = disponibilites;

        this.applyFilter(); // Apply filter and pagination after loading

      },

      error: (err) => {

        console.error('Erreur lors du chargement des disponibilités:', err);

      }

    });

  }



  // --- Filtering and Pagination ---

  applyFilter(): void {

    // Apply filter first

    if (this.filterStatus === 'all') {

      this.filteredDisponibilites = [...this.allDisponibilites];

    } else if (this.filterStatus === 'disponible') {

      this.filteredDisponibilites = this.allDisponibilites.filter(d => d.disponible);

    } else { // 'non-disponible'

      this.filteredDisponibilites = this.allDisponibilites.filter(d => !d.disponible);

    }

    // Then apply pagination

    this.currentPage = 1; // Reset to first page on filter change

    this.updatePagination();

  }



  updatePagination(): void {

    this.totalPages = Math.ceil(this.filteredDisponibilites.length / this.itemsPerPage);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    const endIndex = startIndex + this.itemsPerPage;

    this.paginatedDisponibilites = this.filteredDisponibilites.slice(startIndex, endIndex);

  }



  setFilter(status: 'all' | 'disponible' | 'non-disponible'): void {

    this.filterStatus = status;

    this.applyFilter();

  }



  goToPage(page: number): void {

    if (page >= 1 && page <= this.totalPages) {

      this.currentPage = page;

      this.updatePagination();

    }

  }



  nextPage(): void {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.updatePagination();

    }

  }



  prevPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.updatePagination();

    }

  }



  // --- Actions for Individual Availabilities (Modify/Delete) ---

  onModifyClick(dispo: CalendrierDisponibilite): void {

    this.selectedAvailabilityToModify = dispo;

    this.modifierForm.patchValue({

      date: dispo.date,

      disponible: dispo.disponible

    });

  }



  modifierDisponibilite(): void {

    if (this.modifierForm.valid && this.technicienId && this.selectedAvailabilityToModify) {

      const request = {

        technicienId: this.technicienId,

        date: this.modifierForm.value.date,

        disponible: this.modifierForm.value.disponible

      };

      this.calendrierService.modifierDisponibilite(request).subscribe({

        next: (disponibilite) => {

          alert('Disponibilité modifiée avec succès !');

          this.loadDisponibilites(this.technicienId!); // Reload all to re-apply filters/pagination

          this.modifierForm.reset();

          this.selectedAvailabilityToModify = null;

        },

        error: (err) => {

          alert('Erreur lors de la modification: ' + (err.error || 'Une erreur inconnue est survenue.'));

          console.error(err);

        }

      });

    } else {

      alert("Veuillez sélectionner une disponibilité à modifier et remplir les champs.");

    }

  }



  onDeleteClick(dispo: CalendrierDisponibilite): void {

    this.selectedAvailabilityToDelete = dispo;

    this.supprimerForm.patchValue({

      date: dispo.date

    });

  }



  supprimerDisponibilite(): void {

    if (this.supprimerForm.valid && this.technicienId && this.selectedAvailabilityToDelete) {

      const date = this.supprimerForm.value.date;

      this.calendrierService.supprimerDisponibilite(this.technicienId, date).subscribe({

        next: () => {

          alert('Disponibilité supprimée avec succès !');

          this.loadDisponibilites(this.technicienId!); // Reload all to re-apply filters/pagination

          this.supprimerForm.reset();

          this.selectedAvailabilityToDelete = null;

        },

        error: (err) => {

          alert('Erreur lors de la suppression: ' + (err.error || 'Une erreur inconnue est survenue.'));

          console.error(err);

        }

      });

    } else {

      alert("Veuillez sélectionner une disponibilité à supprimer.");

    }

  }



  // --- Get Unavailable Days ---

getJoursNonDisponibles(): void {
  if (this.nonDisponiblesForm.valid && this.technicienId) {
    let { dateDebut, dateFin } = this.nonDisponiblesForm.value;
    // Ensure dates are in yyyy-MM-dd format
    dateDebut = new Date(dateDebut).toISOString().split('T')[0];
    dateFin = new Date(dateFin).toISOString().split('T')[0];
    this.calendrierService.getJoursNonDisponibles(this.technicienId, dateDebut, dateFin).subscribe({
      next: (nonDisponibilites) => {
        this.nonDisponibilitesSearchResults = nonDisponibilites;
        if (nonDisponibilites.length === 0) {
          alert('Aucun jour non disponible trouvé pour la période sélectionnée.');
        }
      },
      error: (err) => {
        alert('Erreur lors de la récupération des jours non disponibles: ' + (err.error || 'Une erreur inconnue est survenue.'));
        console.error(err);
      }
    });
  }
}



  // --- Add Single Availability ---

  ajouterDisponibiliteSingle(): void {

    if (this.singleDisponibiliteForm.valid && this.technicienId) {

      const request = {

        technicienId: this.technicienId,

        date: this.singleDisponibiliteForm.value.date,

        disponible: this.singleDisponibiliteForm.value.disponible

      };

      this.calendrierService.ajouterDisponibilite(request).subscribe({

        next: (disponibilite) => {

          alert('Disponibilité ajoutée avec succès !');

          this.loadDisponibilites(this.technicienId!);

          this.singleDisponibiliteForm.reset();

          this.singleDisponibiliteForm.patchValue({ disponible: false });

        },

        error: (err) => {

          alert('Erreur lors de l’ajout: ' + (err.error?.message || err.message || 'Une erreur inconnue est survenue.'));

          console.error(err);

        }

      });

    }

  }



  // --- Add Bulk Availabilities ---

  ajouterDisponibilitesEnMasse(): void {

    if (this.masseForm.valid && this.technicienId) {

      const request = {

        technicienId: this.technicienId,

        dateDebut: this.masseForm.value.dateDebut,

        dateFin: this.masseForm.value.dateFin,

        disponible: this.masseForm.value.disponible

      };

      this.calendrierService.ajouterDisponibilitesEnMasse(request).subscribe({

        next: (disponibilites) => {

          alert('Disponibilités ajoutées en masse avec succès !');

          this.loadDisponibilites(this.technicienId!);

          this.masseForm.reset();

          this.masseForm.patchValue({ disponible: false });

        },

        error: (err) => {

          alert('Erreur lors de l’ajout en masse: ' + (err.error || 'Une erreur inconnue est survenue.'));

          console.error(err);

        }

      });

    }

  }



  // --- UI Toggle Methods ---

  toggleAddForm(showSingle: boolean): void {

    this.showAddSingleForm = showSingle;

    if (showSingle) {

      this.masseForm.reset();

      this.masseForm.patchValue({ disponible: false });

    } else {

      this.singleDisponibiliteForm.reset();

      this.singleDisponibiliteForm.patchValue({ disponible: false });

    }

  }

}