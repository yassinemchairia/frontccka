import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


export interface TechnicienStatsDTO {
  numeroTelephone: string;
  idUser: number;
  nom: string;
  prenom: string;
  specialite: string;
  nbInterventions: number;
  dureeTotale: string;
  dureeMoyenne: string;
  tauxReussite: string;
  statsParPriorite: { [key: string]: number };
  statsParType: { [key: string]: number };
}
export interface UpdateProfileRequest {
  nom: string;
  prenom: string;
  numeroTelephone: string;
}

export interface Utilisateur {
  idUser: number;
  nom: string;
  prenom: string;
  numeroTelephone: string;
}
@Injectable({
  providedIn: 'root'
})
export class TechnicienStatsService {

  private apiUrl = 'http://192.168.107.129:8087/api/stats/technicien'; // Remplacez par l'URL de votre API
  private ApiUrl = 'http://192.168.107.129:8087/api/stats/technicien'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTechnicienStats(id: number): Observable<TechnicienStatsDTO> {
    return this.http.get<TechnicienStatsDTO>(`${this.apiUrl}/${id}`);
  }
  updateProfile(userId: number, request: UpdateProfileRequest): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.ApiUrl}/updateprofile/${userId}`, request, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
