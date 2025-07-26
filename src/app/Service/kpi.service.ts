import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KpiService {
  private apiUrl = 'http://localhost:8087'; // Adaptez selon votre configuration

  constructor(private http: HttpClient) { }

  getResolutionRate(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/alertes/taux-resolution`);
  }

  getAverageCost(): Observable<number> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/api/statistics/costs/average-by-type`)
      .pipe(
        map(data => {
          const values = Object.values(data);
          return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
        })
      );
  }

  getGlobalSatisfaction(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/api/statistics/satisfaction/average`);
  }

  getPreventiveStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/statistiques/preventions`);
  }
  
}
