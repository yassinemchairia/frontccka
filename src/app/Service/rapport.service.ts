import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , of} from 'rxjs';
import { Rapport } from '../Service/rapport.model';
import{RapportIntervention} from '../Service/R.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RapportService {

 private apiUrl = 'http://192.168.107.129:8087/api/rapport';

  constructor(private http: HttpClient) { }

  ajouterRapport(interventionId: number, rapport: Rapport): Observable<Rapport> {
    return this.http.post<Rapport>(`${this.apiUrl}/ajouterRapport/${interventionId}`, rapport);
  }
  getRapportsByUserId(userId: number): Observable<RapportIntervention[]> {
    return this.http.get<RapportIntervention[]>(`${this.apiUrl}/mesrapport`, {
      params: { idUser: userId.toString() }
    }).pipe(
      catchError(this.handleError<RapportIntervention[]>('getRapportsByUserId', []))
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      console.error('Status:', error.status);
      console.error('Status Text:', error.statusText);
      console.error('Error Message:', error.message);
      return of(result as T);
    };
  }
}
