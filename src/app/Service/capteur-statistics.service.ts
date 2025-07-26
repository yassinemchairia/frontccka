import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CapteurStatisticsService {
  private apiUrl = 'http://localhost:8087/api/statistics/capteurs'; // Update with your API endpoint

  constructor(private http: HttpClient) { }

  getAlertesByCapteur(): Observable<any> {
    return this.http.get(`${this.apiUrl}/alertes-par-capteur`);
  }

  getRepartitionByType(): Observable<any> {
    return this.http.get(`${this.apiUrl}/repartition-types`);
  }

  getMostActiveCapteurs(limit: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/capteurs-actifs?limit=${limit}`);
  }

  getFullCapteursStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/full-stats`);
  }

  getFullCapteursStatsBetweenDates(start: Date, end: Date): Observable<any[]> {
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    return this.http.get<any[]>(`${this.apiUrl}/full-stats/Between?startDate=${startStr}&endDate=${endStr}`);
  }
}