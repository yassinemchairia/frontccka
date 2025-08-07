import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticationRequest } from './utilisateur.model';
import { TokenResponse } from './token-response.model';
import { RegistrationRequest } from './registration-request.model';
import { Utilisateur } from './utilisateur.model';
import { Technicien } from './utilisateur.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://192.168.107.129:8087';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserRole = new BehaviorSubject<string>('');
  private currentUserId = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  get isLoggedIn$() {
    return this.loggedIn.asObservable();
  }

  get currentUserRole$() {
    return this.currentUserRole.asObservable();
  }

  get currentUserId$() {
    return this.currentUserId.asObservable();
  }

  getCurrentUserId(): number | null {
    return this.currentUserId.value;
  }

  login(email: string, password: string): Observable<TokenResponse> {
    const body = { email, motDePasse: password };
    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/login`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      tap(response => {
        this.storeTokens(response);
        this.loggedIn.next(true);
        this.setUserDetails();
        // Redirection en fonction du rôle
        const role = this.currentUserRole.value;
        if (role === 'ADMIN') {
          this.router.navigate(['/pages/capteur-monitoring']);
        } else if (role === 'TECHNICIEN') {
          this.router.navigate(['/pages/technicien-stats']);
        } 
      })
    );
  }
requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/password/reset-request`, null, {
      params: { email }
    });
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<void> {
    const body = { email, token, newPassword };
    return this.http.post<void>(`${this.apiUrl}/api/password/reset`, body);
  }
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (payload.exp * 1000) < Date.now();
    } catch {
      return true;
    }
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(response => {
        this.storeTokens(response);
        this.setUserDetails();
      })
    );
  }

  logout(): void {
    this.clearTokens();
    this.loggedIn.next(false);
    this.currentUserRole.next('');
    this.currentUserId.next(null);
    this.router.navigate(['/auth/login']);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  validateTechnician(idUser: number, isApproved: boolean): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/validerTechnicien/${idUser}`, null, {
      params: { isApproved: isApproved.toString() }
    });
  }

  getNonValidatedTechnicians(): Observable<Technicien[]> {
    return this.http.get<Technicien[]>(`${this.apiUrl}/techniciens/non-valides`);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem('refresh_token');
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  isAdmin(): boolean {
    return this.currentUserRole.value === 'ADMIN';
  }

  private storeTokens(tokens: TokenResponse): void {
    sessionStorage.setItem('access_token', tokens.accessToken);
    sessionStorage.setItem('refresh_token', tokens.refreshToken);
  }

  private clearTokens(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  }

  private checkToken(): void {
    const token = this.getAccessToken();
    if (token) {
      const isExpired = this.isTokenExpired(token);
      if (!isExpired) {
        this.loggedIn.next(true);
        this.setUserDetails();
      } else {
        this.clearTokens();
      }
    }
  }

  private setUserDetails(): void {
    const token = this.getAccessToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role || '';
        const idUser = payload.idUser || null;
        this.currentUserRole.next(role);
        this.currentUserId.next(idUser);
        console.log('User role detected:', role);
        console.log('User ID detected:', idUser);
      } catch (e) {
        console.error('Error parsing token:', e);
        this.currentUserRole.next('');
        this.currentUserId.next(null);
      }
    }
  }
}
