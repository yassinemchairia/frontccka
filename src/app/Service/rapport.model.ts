export interface Rapport {
  id?: number;
  details: string;
  coutIntervention: number;
  satisfaction: number; // 1-5
  interventionId: number;
}