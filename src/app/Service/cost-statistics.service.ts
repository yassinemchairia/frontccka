import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CostStatisticsService {
  private apiUrl = 'http://localhost:8087/api/statistics/costs'; // Update with your API endpoint

  constructor(private http: HttpClient) { }

  getMonthlyCosts(monthsBack: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/monthly?monthsBack=${monthsBack}`);
  }

  getAverageCostByType(): Observable<any> {
    return this.http.get(`${this.apiUrl}/average-by-type`);
  }

  getDetailedCostStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/detailed`);
  }

  getAnnualCosts(year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/annual?year=${year}`);
  }

  getCostByTechnicien(): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-technicien`);
  }

  getDetailedCostByTechnicien(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-technicien/detailed`);
  }
}