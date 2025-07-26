import { Utilisateur } from './utilisateur.model';  // Importer le modèle Utilisateur

export interface Technicien extends Utilisateur { 
  specialite: 'ELECTRICITE' | 'CLIMATISATION' | 'ENVIRONNEMENT';  // Enum des spécialités
  numeroTelephone: string;
  dateDisponibilite: Date; // ou `Date` si c’est déjà converti côté backend

}
