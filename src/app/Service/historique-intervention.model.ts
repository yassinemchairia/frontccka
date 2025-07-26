export enum Statut {
     EN_COURS = 'EN_COURS',
     TERMINEE = 'TERMINEE'
   }

   export interface HistoriqueIntervention {
     idHistoriqueIntervention: number;
     interventionId: number;
     techniciens: string[];
     rapport: string;
     description: string;
     dateAction: Date; // Changed from string to Date
     statut: Statut;
   }

   export interface HistoriqueInterventionDTO {
     interventionId: number;
     description: string;
     rapport: string;
     statut: Statut;
   }