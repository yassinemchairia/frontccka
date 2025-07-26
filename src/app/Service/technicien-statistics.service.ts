import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TechnicienStatisticsService {

  private apiUrl = 'http://localhost:8087'; // Update with your API endpoint

  constructor(private http: HttpClient) { }

  getInterventionsByTechnicien(): Observable<any> {
    return this.http.get(`${this.apiUrl}/interventions-count`);
  }

  getSatisfactionMoyenne(): Observable<any> {
    return this.http.get(`${this.apiUrl}/satisfaction-moyenne`);
  }

  getDisponibilite(): Observable<any> {
    return this.http.get(`${this.apiUrl}/disponibilite`);
  }

  getSpecialitesSollicitees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/specialites-sollicitees`);
  }

  getFullTechniciensStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/full-stats`);
  }
}