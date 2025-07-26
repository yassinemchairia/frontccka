export interface InterventionDTO {
  idInterv: number;
  dateDebut: Date;
  dateFin: Date | null;
  statut: 'EN_COURS' | 'TERMINEE';
  typeIntervention: 'PREVENTIVE' | 'CORRECTIVE';
  priorite: 'BASSE' | 'MOYENNE' | 'ELEVEE';
}
