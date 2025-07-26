export interface TechnicienStatsDTO {
  idUser: number;
  nom: string;
  specialite: string;
  nbInterventions: number;
  dureeTotale: string;
  dureeMoyenne: string;
  tauxReussite: string;
  statsParPriorite: { [key: string]: number };
  statsParType: { [key: string]: number };
}