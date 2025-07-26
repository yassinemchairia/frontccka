import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoriqueIntervention } from '../Service/historique.model';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueService {
  private apiUrl = 'http://localhost:8087/api/historique';

  constructor(private http: HttpClient) {}

  ajouterHistorique(interventionId: number, description: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/ajouter/${interventionId}?description=${description}`, null, { responseType: 'text' });
  }
//ajouterHistorique(interventionId: number, description: string, rapport: string, statut: string): Observable<any> {
    //return this.http.post(`${this.apiUrl}/ajouter-historique`, null, {
     // params: {
      //  interventionId: interventionId.toString(),
       // description,
       // rapport,
       // statut
      //}
    //});
  //}

  terminerIntervention(interventionId: number, rapportFinal: string, description: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/terminer`, null, {
      params: {
        interventionId: interventionId.toString(),
        rapportFinal,
        description
      }
    });
  }

  ajouterMiseAJour(interventionId: number, description: string, rapport: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/mise-a-jour`, null, {
      params: {
        interventionId: interventionId.toString(),
        description,
        rapport
      }
    });
  }
}