export interface CalendrierDisponibilite {
  id?: number;
  date: string; // Format: yyyy-MM-dd
  disponible: boolean;
  technicien?: {
    idUser: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    valide: boolean;
    specialite?: string;
    numeroTelephone?: string;
  };
}