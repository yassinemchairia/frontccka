import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { InterventionService, InterventionCalendarEvent } from '../../Service/intervention.service';
import {
  addDays, addWeeks, addMonths,
  subDays, subWeeks, subMonths
} from 'date-fns';
import { ActivatedRoute } from '@angular/router'; // Ajoutez cette importation

@Component({
  selector: 'ngx-intervention-calendar',
  templateUrl: './intervention-calendar.component.html',
  styleUrls: ['./intervention-calendar.component.scss']
})
export class InterventionCalendarComponent implements OnInit {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  events: CalendarEvent[] = [];
  refresh: Subject<void> = new Subject<void>();
  technicienId: number;
  message: string = '';

  constructor(private interventionService: InterventionService,
    private route: ActivatedRoute) {}

    ngOnInit(): void {
      this.route.params.subscribe(params => {
        this.technicienId = +params['technicienId']; // Le '+' convertit en number
        if (this.technicienId) {
          this.loadInterventions();
        }
      });
    }

  loadInterventions(): void {
    if (!this.technicienId) {
      this.message = 'Veuillez sélectionner un technicien';
      return;
    }

    let startDate: Date;
    let endDate: Date;

    if (this.view === CalendarView.Month) {
      const year = this.viewDate.getFullYear();
      const month = this.viewDate.getMonth();

      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0);
    } else if (this.view === CalendarView.Week) {
      startDate = subDays(this.viewDate, this.viewDate.getDay());
      endDate = addDays(startDate, 6);
    } else {
      startDate = this.viewDate;
      endDate = this.viewDate;
    }

    this.interventionService.getInterventionsForTechnicien(this.technicienId, startDate, endDate)
      .subscribe((interventions) => {
        this.events = this.mapInterventionsToEvents(interventions);
        this.message = this.events.length === 0 ? 'Aucune intervention trouvée pour cette période.' : '';
        this.refresh.next();
      }, error => {
        console.error("Erreur API :", error);
        this.message = 'Erreur lors du chargement des interventions';
      });
  }

  private mapInterventionsToEvents(interventions: InterventionCalendarEvent[]): CalendarEvent[] {
    return interventions.map((intervention) => {
      const start = new Date(intervention.start);
      
      return {
        id: intervention.idInterv,
        title: `${intervention.title} (${intervention.statut}) - ${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
        start: start,
        color: this.getColorForIntervention(intervention),
        meta: {
          type: intervention.typeIntervention,
          priority: intervention.priorite,
          status: intervention.statut
        }
      };
    });
  }

  private getColorForIntervention(intervention: InterventionCalendarEvent): any {
    // Personnalisez les couleurs selon vos besoins
    if (intervention.color) {
      return { primary: intervention.color, secondary: this.lightenColor(intervention.color) };
    }

    const colors: Record<string, string> = {
      'EN_COURS': '#ff8c00', // Orange
      'TERMINEE': '#2e8b57', // Vert
      'PREVENTIVE': '#4682b4', // Bleu acier
      'CORRECTIVE': '#cd5c5c', // Rouge indien
      'ELEVEE': '#ff4500',   // Rouge orange
      'MOYENNE': '#ffa500',  // Orange
      'BASSE': '#9acd32'     // Jaune vert
    };

    const color = colors[intervention.statut] || 
                 colors[intervention.typeIntervention] || 
                 colors[intervention.priorite] || 
                 '#1e90ff'; // Bleu dodger par défaut

    return { 
      primary: color,
      secondary: this.lightenColor(color)
    };
  }

  private lightenColor(color: string, percent = 40): string {
    // Fonction utilitaire pour éclaircir une couleur hex
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)}`;
  }

  changeDate(direction: number): void {
    if (this.view === CalendarView.Day) {
      this.viewDate = addDays(this.viewDate, direction);
    } else if (this.view === CalendarView.Week) {
      this.viewDate = addWeeks(this.viewDate, direction);
    } else {
      this.viewDate = addMonths(this.viewDate, direction);
    }

    this.loadInterventions();
  }

  goToToday(): void {
    this.viewDate = new Date();
    this.loadInterventions();
  }

  setTechnicienId(id: number): void {
    this.technicienId = id;
    this.loadInterventions();
  }

  setView(view: CalendarView): void {
    this.view = view;
    this.loadInterventions();
  }
}