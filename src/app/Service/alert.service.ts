import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alerte } from './alerte.model';
import { Technicien } from './technicien.model';
export interface Intervention1DTO {
  idInterv: number;
  alerteId: number;
  dateDebut: string;
  dateFin: string;
  statut: string;
  typeIntervention: string;
  priorite: string;
  solution: string;
  satisfaction: number;
}
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private apiUrl = 'http://192.168.107.129:8087/alertes';
  constructor(private http: HttpClient) {}

  predictSolution(alerte: Alerte): Observable<{ solution: string; similar_alertes: any[] }> {
    const payload = {
      typePanne: alerte.typePanne,
      niveauGravite: alerte.niveauGravite,
      valeurDeclenchement: alerte.valeurDeclenchement || 0,
      typeCapteur: alerte.typeCapteur,
      emplacement: alerte.emplacement,
      description: alerte.description || '',
    };
    return this.http.post<{ solution: string; similar_alertes: any[] }>(`${this.apiUrl}/predict`, payload);
  }
  createIntervention(idAlerte: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/predict-and-create-intervention/${idAlerte}`, {});
  }
getResolvedAIAlerts(): Observable<Alerte[]> {
    return this.http.get<Alerte[]>(`${this.apiUrl}/resolved-ai`);
  }
  getResolvedAIAlertsByDateRange(startDate: string, endDate: string): Observable<Alerte[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Alerte[]>(`${this.apiUrl}/resolved-ai/by-date-range`, { params });
  }

  getAverageSatisfactionForAIAlerts(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/resolved-ai/average-satisfaction`);
  }
  declencherAlerte(idCapt: number, typePanne: string, niveauGravite: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/declencher/${idCapt}`, null, {
      params: new HttpParams()
        .set('typePanne', typePanne)
        .set('niveauGravite', niveauGravite),
    });
  }

  getAlertes(): Observable<Alerte[]> {
    return this.http.get<Alerte[]>(`${this.apiUrl}/liste`);
  }

  getTechniciens(): Observable<Technicien[]> {
    return this.http.get<Technicien[]>(`${this.apiUrl}/techniciens`);
  }

  getAlertesParType(typePanne: string): Observable<Alerte[]> {
    return this.http.get<Alerte[]>(`${this.apiUrl}/type`, {
      params: new HttpParams().set('typePanne', typePanne),
    });
  }

  getAlertesParGravite(niveauGravite: string): Observable<Alerte[]> {
    return this.http.get<Alerte[]>(`${this.apiUrl}/gravite`, {
      params: new HttpParams().set('niveauGravite', niveauGravite),
    });
  }

  getAlertesParResolution(estResolu: boolean): Observable<Alerte[]> {
    return this.http.get<Alerte[]>(`${this.apiUrl}/resolution`, {
      params: new HttpParams().set('estResolu', estResolu.toString()),
    });
  }

  searchAlertes(typePanne?: string, niveauGravite?: string, estResolu?: boolean): Observable<Alerte[]> {
    let params = new HttpParams();
    if (typePanne) params = params.set('typePanne', typePanne);
    if (niveauGravite) params = params.set('niveauGravite', niveauGravite);
    if (estResolu !== undefined) params = params.set('estResolu', estResolu.toString());

    return this.http.get<Alerte[]>(`${this.apiUrl}/search`, { params });
  }

  getAlertByType(): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-type`);
  }

  getAlertesByGravite(): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-gravite`);
  }

  getAverageResolutionTime(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/temps-moyen-resolution`);
  }

  getResolutionRate(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/taux-resolution`);
  }
  getInterventionDetailsForAlert(idAlerte: number): Observable<Intervention1DTO> {
    return this.http.get<Intervention1DTO>(`${this.apiUrl}/resolved-ai/${idAlerte}/intervention`);
  }

  exportResolvedAIAlertsToCSV(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/resolved-ai/export-csv`, { responseType: 'blob' });
  }
}
