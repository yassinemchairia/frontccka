import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeStatisticsService {
  private apiUrl = 'http://localhost:8087/api/statistics/time'; // Update with your API endpoint

  constructor(private http: HttpClient) { }

  getAlertCountByPeriod(unit: string, periodCount: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/alertes?unit=${unit}&periodCount=${periodCount}`);
  }

  getInterventionCountByPeriod(unit: string, periodCount: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/interventions?unit=${unit}&periodCount=${periodCount}`);
  }

  getCriticalHours(): Observable<any> {
    return this.http.get(`${this.apiUrl}/heures-critiques`);
  }

  getCriticalDays(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jours-critiques`);
  }
}