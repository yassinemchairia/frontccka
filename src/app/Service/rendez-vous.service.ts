import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AutoPlanificationRequest, RendezVous, RendezVousRequest, SuggestionResponse } from './AutoPlanificationRequest';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private apiUrl = 'http://localhost:8087/api/rendezvous';

  constructor(private http: HttpClient) { }

  getSuggestions(request: AutoPlanificationRequest): Observable<SuggestionResponse> {
    return this.http.post<SuggestionResponse>(`${this.apiUrl}/suggerer`, request)
      .pipe(
        catchError(error => {
          if (error.error && typeof error.error === 'object') {
            return throwError(() => error.error);
          }
          return this.handleError(error);
        })
      );
  }
getRendezVousByUserId(userId: number): Observable<RendezVous[]> {
  return this.http.get<RendezVous[]>(`${this.apiUrl}/user?idUser=${userId}`, {
    headers: { 'Authorization': `Bearer ${this.getToken()}` }
  }).pipe(
    catchError(this.handleError)
  );
}

private getToken(): string {
  return localStorage.getItem('token') || '';
}
  createRendezVous(request: RendezVousRequest): Observable<RendezVous> {
    const formattedRequest = {
      adminId: request.adminId,
      description: request.description,
      date: this.formatDateForBackend(request.date),
      technicienIds: request.technicienIds
    };
    
    return this.http.post<RendezVous>(`${this.apiUrl}/ajouter`, formattedRequest, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  private formatDateForBackend(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString();
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inattendue est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status) {
      errorMessage = `Erreur ${error.status}: ${error.message}`;
    }

    console.error('Erreur complète:', {
      status: error.status,
      message: error.message,
      error: error.error,
      url: error.url
    });
    
    return throwError(() => ({ 
      message: errorMessage,
      details: error.error?.details || null
    }));
  }
}