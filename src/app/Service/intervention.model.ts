export interface Intervention {
    dateDebut: string; // format ISO (yyyy-MM-ddTHH:mm)
    priorite: 'BASSE' | 'MOYENNE' | 'ELEVEE';
    typeIntervention: 'PREVENTIVE' | 'CORRECTIVE';
    techniciens: { idUser: number }[]; // liste des techniciens affectés
    alerte: { idAlerte: number }; // alerte concernée
  }