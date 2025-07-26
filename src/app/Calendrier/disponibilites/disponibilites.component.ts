import { Component, OnInit } from '@angular/core';
import { CalendrierDisponibiliteServiceService } from '../../Service/calendrier-disponibilite-service.service';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { Technicien } from '../../Service/technicien.model';

import {
  addDays, addWeeks, addMonths,
  subDays, subWeeks, subMonths
} from 'date-fns';
@Component({
  selector: 'ngx-disponibilites',
  templateUrl: './disponibilites.component.html',
  styleUrls: ['./disponibilites.component.scss']
})
export class DisponibilitesComponent implements OnInit {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView; // ✅ Expose CalendarView au template
  events = [];
  techniciensDisponibles: Technicien[] = [];
  refresh: Subject<void> = new Subject<void>();
  specialiteFilter: string = '';
  techniciensFiltres: Technicien[] = [];
  techniciensDejaAffiches: number[] = [];
  message: string = '';

  constructor(private calendrierService: CalendrierDisponibiliteServiceService) {}

  ngOnInit(): void {
    this.loadTechniciensDisponibles();
  }

  loadTechniciensDisponibles(): void {
    let startDate: string;
    let endDate: string;
  
    if (this.view === CalendarView.Month) {
      const year = this.viewDate.getFullYear();
      const month = this.viewDate.getMonth(); // 0-indexed
  
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0); // dernier jour du mois
  
      startDate = firstDay.toISOString().split('T')[0];
      endDate = lastDay.toISOString().split('T')[0];
  
      this.calendrierService.getTechniciensDisponiblesParPeriode(startDate, endDate)
        .subscribe((techniciens) => {
          this.techniciensDisponibles = techniciens;
          this.loadEvents();
          this.message = this.techniciensDisponibles.length === 0 ? 'Aucun technicien disponible pour cette spécialité et période.' : '';
          this.refresh.next();
        }, error => console.error("Erreur API :", error));
  
    } else {
      // Vue jour ou semaine → on garde l’appel classique
      const today = this.viewDate.toISOString().split('T')[0];
      this.calendrierService.getTechniciensDisponibles(today)
        .subscribe((techniciens) => {
          this.techniciensDisponibles = techniciens;
          this.loadEvents();
          this.message = this.techniciensDisponibles.length === 0 ? 'Aucun technicien disponible pour cette spécialité et période.' : '';
          this.refresh.next();
        }, error => console.error("Erreur API :", error));
    }
  }
  
  
  

  loadEvents(): void {
    console.log("Chargement des events pour les techniciens :", this.techniciensDisponibles);
  
    this.events = this.techniciensDisponibles.map((technicien) => {
      const date = new Date(technicien.dateDisponibilite);
      console.log("Date dispo pour", technicien.nom, ":", date); // 👈
  
      return {
        title: `${technicien.email} `,
        start: new Date(date.setHours(0, 0, 0)),
        end: new Date(date.setHours(23, 59, 59)),
        allDay: true,
        color: { primary: '#1e90ff', secondary: '#87cefa' }
      };
    });
  }
  
  filtrerParSpecialiteEtPeriode(): void {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
  
    const dateDebut = firstDay.toISOString().split('T')[0];
    const dateFin = lastDay.toISOString().split('T')[0];
  
    this.calendrierService
      .getTechniciensDisponiblesParIntervalleEtSpecialite(dateDebut, dateFin, this.specialiteFilter, [])
      .subscribe((techniciens) => {
        this.techniciensDisponibles = [];
        this.events = [];
        this.techniciensDejaAffiches = [];
  
        // ✅ Conversion des dates string en objets Date
        this.techniciensFiltres = techniciens.map(t => ({
          ...t,
          dateDisponibilite: new Date(t.dateDisponibilite)
        }));
  
        // Vérifie si la liste des techniciens filtrés est vide
        if (this.techniciensFiltres.length > 0) {
          this.techniciensDejaAffiches.push(...this.techniciensFiltres.map(t => t.idUser));
          this.techniciensDisponibles.push(...this.techniciensFiltres);
          this.loadEvents();
          this.message = ''; // Réinitialiser le message s'il y a des techniciens
        } else {
          this.message = 'Aucun technicien disponible pour cette spécialité et période.';
        }
  
        this.refresh.next();
      }, error => {
        console.error("Erreur API filtre spécialité :", error);
        this.message = 'Erreur de récupération des données.';
      });
  }
  
  
  
  changeDate(direction: number): void {
    if (this.view === CalendarView.Day) {
      this.viewDate = addDays(this.viewDate, direction);
    } else if (this.view === CalendarView.Week) {
      this.viewDate = addWeeks(this.viewDate, direction);
    } else {
      this.viewDate = addMonths(this.viewDate, direction);
    }
  
    // Réinitialiser le message avant de charger les techniciens
    this.message = '';
  
    // Recharger les techniciens après le changement de mois
    this.loadTechniciensDisponibles();
  }
  goToToday(): void {
    this.viewDate = new Date(); // Définit la date de la vue sur aujourd'hui
    this.loadTechniciensDisponibles(); // Recharge les techniciens disponibles pour la journée actuelle
  }
  reinitialiserFiltre(): void {
    this.specialiteFilter = '';
    this.message = '';
    this.loadTechniciensDisponibles(); // recharge les techniciens normalement
  }
  
}