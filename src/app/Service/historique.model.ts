export interface HistoriqueIntervention {
  idHistoriqueIntervention?: number;
  description: string;
  dateAction?: string;
  rapport?: string;
  statut?: 'EN_COURS' | 'TERMINEE';
}