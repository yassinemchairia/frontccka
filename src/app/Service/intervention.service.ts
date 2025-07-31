import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { TechnicienDTO } from './technicien-dto.model';
import { HistoriqueIntervention, HistoriqueInterventionDTO } from './historique-intervention.model';
import { InterventionDTO } from './InterventionDTO.model';
import { RapportIntervention } from './R.model';
import { AuthService } from './auth.service'; // Import AuthService

export type InterventionStatus = 'EN_COURS' | 'TERMINEE';
export type InterventionType = 'PREVENTIVE' | 'CORRECTIVE';
export type InterventionPriority = 'BASSE' | 'MOYENNE' | 'ELEVEE';

export interface InterventionCalendarEvent {
  idInterv: number;
  title: string;
  start: string;
  end: string;
  statut: string;
  typeIntervention: string;
  priorite: string;
  color: string;
}

interface PredictionRequest {
  dateDebut: string;
  specialite: string;
  typeIntervention: string;
  priorite: string;
  dureeEstimee: number;
}

interface PredictionResponse {
  status: string;
  techniciens: number[];
  probabilites: number[];
  specialiteDemandee?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterventionService {
  private apiUrl = 'http://192.168.107.129:8087/interventions';
  private historiqueApiUrl = 'http://192.168.107.129:8087/api/historique';
  private rapportApiUrl = 'http://192.168.107.129:8087/api/rapport';
  private predictionApiUrl = 'http://192.168.107.129:8087/api/predict';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Helper method to add Authorization header
  private getAuthHeaders(): HttpHeaders {
  const token = this.authService.getAccessToken();
  return new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  });
}

  getTechniciensAffectes(idInterv: number): Observable<TechnicienDTO[]> {
    return this.http.get<TechnicienDTO[]>(`${this.apiUrl}/${idInterv}/techniciens`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError<TechnicienDTO[]>('getTechniciensAffectes', []))
    );
  }

  getAllInterventions(): Observable<InterventionDTO[]> {
    return this.http.get<InterventionDTO[]>(`${this.apiUrl}/afficher-intervention`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError<InterventionDTO[]>('getAllInterventions', []))
    );
  }

  ajouterIntervention(intervention: any): Observable<any> {
    // Send request without Authorization header
    return this.http.post(`${this.apiUrl}/ajouter`, intervention, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError<any>('ajouterIntervention'))
    );
  }

  ajouterRapport(interventionId: number, rapport: RapportIntervention): Observable<RapportIntervention> {
    return this.http.post<RapportIntervention>(`${this.rapportApiUrl}/ajouterRapport/${interventionId}`, rapport, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError<RapportIntervention>('ajouterRapport'))
    );
  }

  predictTechnicians(interventionData: PredictionRequest): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(
      this.predictionApiUrl,
      interventionData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError<PredictionResponse>('predictTechnicians', {
        status: 'error',
        techniciens: [],
        probabilites: []
      }))
    );
  }

  predireTechnicien(data: {
    dateDebut: string,
    specialite: string,
    typeIntervention: string,
    priorite: string,
    dureeEstimee: number
  }): Observable<PredictionResponse> {
    return this.predictTechnicians(data);
  }

  getInterventionsByTechnicienId(idTechnicien: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/technicien/${idTechnicien}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError<any[]>('getInterventionsByTechnicienId', []))
    );
  }

  getInterventionsForTechnicien(
    technicienId: number,
    startDate?: Date,
    endDate?: Date
  ): Observable<InterventionCalendarEvent[]> {
    const url = `${this.apiUrl}/vvbvtechnicien/${technicienId}`;
    let params = {};
    if (startDate && endDate) {
      params = {
        start: this.formatDateForAPI(startDate),
        end: this.formatDateForAPI(endDate)
      };
    } else if (startDate) {
      params = { start: this.formatDateForAPI(startDate) };
    }
    return this.http.get<InterventionCalendarEvent[]>(url, { headers: this.getAuthHeaders(), params }).pipe(
      catchError(this.handleError<InterventionCalendarEvent[]>('getInterventionsForTechnicien', []))
    );
  }

  getHistoriquesParIntervention(idInterv: number): Observable<HistoriqueIntervention[]> {
    return this.http.get<HistoriqueIntervention[]>(`${this.historiqueApiUrl}/intervention/${idInterv}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError<HistoriqueIntervention[]>('getHistoriquesParIntervention', []))
    );
  }

  ajouterHistorique(dto: HistoriqueInterventionDTO): Observable<HistoriqueIntervention> {
    return this.http.post<HistoriqueIntervention>(`${this.historiqueApiUrl}/ajouter-historique`, dto, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError<HistoriqueIntervention>('ajouterHistorique'))
    );
  }

  ajouterMiseAJour(interventionId: number, description: string, rapport: string): Observable<HistoriqueIntervention> {
    const params = { interventionId: interventionId.toString(), description, rapport };
    return this.http.post<HistoriqueIntervention>(`${this.historiqueApiUrl}/mise-a-jour`, null, {
      headers: this.getAuthHeaders(),
      params
    }).pipe(
      catchError(this.handleError<HistoriqueIntervention>('ajouterMiseAJour'))
    );
  }

  searchHistoriques(term: string): Observable<HistoriqueIntervention[]> {
    return this.http.get<HistoriqueIntervention[]>(`${this.historiqueApiUrl}/search`, {
      headers: this.getAuthHeaders(),
      params: { term }
    }).pipe(
      catchError(this.handleError<HistoriqueIntervention[]>('searchHistoriques', []))
    );
  }

  getInterventionByTechnicienId(idTechnicien: number): Observable<InterventionDTO[]> {
    return this.http.get<InterventionDTO[]>(`${this.apiUrl}/technicien/${idTechnicien}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des interventions', error);
        return of([]);
      })
    );
  }

  getInterventionsByType(startDate?: Date | null, endDate?: Date | null): Observable<any> {
    let params: any = {};
    if (startDate && endDate) {
      params.startDate = startDate.toISOString().split('T')[0];
      params.endDate = endDate.toISOString().split('T')[0];
    }
    return this.http.get(`${this.apiUrl}/by-type`, { headers: this.getAuthHeaders(), params });
  }

  getInterventionsByStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-status`, { headers: this.getAuthHeaders() });
  }

  getAverageInterventionDuration(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/average-duration`, { headers: this.getAuthHeaders() });
  }

  getInterventionsByPriority(): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-priority`, { headers: this.getAuthHeaders() });
  }

  private formatDateForAPI(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message || error.statusText || 'Unknown error'}`);
      return of(result as T);
    };
  }
}
