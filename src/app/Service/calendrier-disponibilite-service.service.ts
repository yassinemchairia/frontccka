import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendrierDisponibilite } from './CalendrierDisponibilite';
import { Technicien } from '../../app/Service/technicien.model';

@Injectable({
  providedIn: 'root'
})
export class CalendrierDisponibiliteServiceService {
  private apiUrl = 'http://192.168.107.129:8087/api/disponibilites'; // à adapter

  constructor(private http: HttpClient) {}

  getDisponibilitesTechnicien(idTechnicien: number): Observable<CalendrierDisponibilite[]> {
    return this.http.get<CalendrierDisponibilite[]>(`${this.apiUrl}/${idTechnicien}`);
  }

  ajouterDisponibilite(disponibilite: { technicienId: number, date: string, disponible: boolean }): Observable<CalendrierDisponibilite> {
    return this.http.post<CalendrierDisponibilite>(`${this.apiUrl}/ajouter`, disponibilite);
  }
  getTechniciensDisponibles(date: string): Observable<Technicien[]> {
    return this.http.get<Technicien[]>(`${this.apiUrl}/techniciens-disponibles?date=${date}`);
  }
  getTechniciensDisponiblesParPeriode(startDate: string, endDate: string): Observable<Technicien[]> {
    return this.http.get<Technicien[]>(
      `${this.apiUrl}/techniciens-disponibles-par-periode?startDate=${startDate}&endDate=${endDate}`
    );
  }
  getTechniciensDisponiblesParIntervalleEtSpecialite(
    dateDebut: string,
    dateFin: string,
    specialite: string,
    techniciensDejaAffiches: number[] = []
  ): Observable<Technicien[]> {
    const params = new URLSearchParams();
    params.set('dateDebut', dateDebut);
    params.set('dateFin', dateFin);
    params.set('specialite', specialite);
    techniciensDejaAffiches.forEach(id => params.append('techniciensDejaAffiches', id.toString()));
  
    return this.http.get<Technicien[]>(`${this.apiUrl}/intervalle-et-specialite?${params.toString()}`);
  }
  modifierDisponibilite(disponibilite: { technicienId: number, date: string, disponible: boolean }): Observable<CalendrierDisponibilite> {
    return this.http.put<CalendrierDisponibilite>(`${this.apiUrl}/modifier`, disponibilite);
  }

  // Nouvelle méthode pour supprimer une disponibilité
  supprimerDisponibilite(technicienId: number, date: string): Observable<void> {
    const params = new HttpParams()
      .set('technicienId', technicienId.toString())
      .set('date', date);
    return this.http.delete<void>(`${this.apiUrl}/supprimer`, { params });
  }

  // Nouvelle méthode pour récupérer les jours non disponibles
  getJoursNonDisponibles(technicienId: number, dateDebut: string, dateFin: string): Observable<CalendrierDisponibilite[]> {
    return this.http.get<CalendrierDisponibilite[]>(`${this.apiUrl}/${technicienId}/non-disponibles?dateDebut=${dateDebut}&dateFin=${dateFin}`);
  }

  // Nouvelle méthode pour ajouter des disponibilités en masse
  ajouterDisponibilitesEnMasse(request: { technicienId: number, dateDebut: string, dateFin: string, disponible: boolean }): Observable<CalendrierDisponibilite[]> {
    return this.http.post<CalendrierDisponibilite[]>(`${this.apiUrl}/masse`, request);
  }
  
}
