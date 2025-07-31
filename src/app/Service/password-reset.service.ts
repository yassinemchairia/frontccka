// src/app/services/password-reset.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PasswordResetRequest } from './password-reset-request.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private apiUrl = 'http://192.168.107.129:8087/api/password';
private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserRole = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }
   get isLoggedIn$() {
    return this.loggedIn.asObservable();
  }

  get currentUserRole$() {
    return this.currentUserRole.asObservable();
  }
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-request`, { email }) ;
     
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset`, { token, newPassword });
  }
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  isAdmin(): boolean {
    return this.currentUserRole.value === 'ADMIN';
  }

  private storeTokens(tokens: TokenResponse): void {
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private checkToken(): void {
    const token = this.getAccessToken();
    if (token) {
      this.loggedIn.next(true);
      this.setUserRole();
    }
  }

  private setUserRole(): void {
    const token = this.getAccessToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserRole.next(payload.roles[0]);
    }
  }
  }
