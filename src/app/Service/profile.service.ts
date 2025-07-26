// src/app/services/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from './utilisateur.model';
import { UpdateProfileRequest } from './update-profile-request.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8087/api/profile';

  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/me`, {
      params: { userId: userId.toString() }
    });
  }

  updateProfile(userId: number, request: UpdateProfileRequest): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/update`, request, {
      params: { userId: userId.toString() }
    });
  }
}