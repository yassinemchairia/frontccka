import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8087/auth'; // ← Ton backend Spring

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
  getTechniciensNonValidés(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/techniciens/non-valides`);
  }
  validerTechnicien(idUser: number, isApproved: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/validerTechnicien/${idUser}?isApproved=${isApproved}`, null);
  }
  
  
}
