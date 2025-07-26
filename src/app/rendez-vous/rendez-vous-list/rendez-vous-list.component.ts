import { Component, OnInit } from '@angular/core';
import { RendezVousService } from '../../Service/rendez-vous.service';
import { RendezVous } from '../../Service/AutoPlanificationRequest';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-rendez-vous-list',
  templateUrl: './rendez-vous-list.component.html',
  styleUrls: ['./rendez-vous-list.component.scss']
})
export class RendezVousListComponent implements OnInit {
  rendezVousList: RendezVous[] = [];
  paginatedRendezVous: RendezVous[] = [];
  isLoading = false;
  errorMessage = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  pageSizeOptions = [3, 6, 9, 12];

  constructor(
    private rendezVousService: RendezVousService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRendezVous();
  }

  loadRendezVous(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const userId = this.authService.getCurrentUserId();
    
    if (userId) {
      this.rendezVousService.getRendezVousByUserId(userId).subscribe({
        next: (data) => {
          this.rendezVousList = data;
          this.totalItems = data.length;
          this.updatePaginatedData();
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des rendez-vous';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.errorMessage = 'Utilisateur non identifié';
      this.isLoading = false;
    }
  }

  formatDate(dateArray: number[]): string {
    if (!dateArray || dateArray.length < 5) return '';
    const [year, month, day, hour, minute] = dateArray;
    return `${day}/${month}/${year} à ${hour}h${minute.toString().padStart(2, '0')}`;
  }

  // Pagination methods
  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRendezVous = this.rendezVousList.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.updatePaginatedData();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}