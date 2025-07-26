import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SatisfactionStatisticsService {
  private apiUrl = 'http://localhost:8087/api/statistics/satisfaction'; // Update with your API endpoint

  constructor(private http: HttpClient) { }

  getGlobalAverageSatisfaction(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/average`);
  }

  getSatisfactionTrend(monthsBack: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/trend?monthsBack=${monthsBack}`);
  }

  getAverageSatisfactionByType(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/by-type`);
  }

  getSatisfactionDistribution(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/distribution`);
  }
}