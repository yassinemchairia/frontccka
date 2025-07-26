
import { Technicien,Admin } from "./utilisateur.model";

export interface AutoPlanificationRequest {
  adminId: number;
  description: string;
  dateSouhaitee: string; // Format YYYY-MM-DD
  dateLimite?: string; // Format YYYY-MM-DD, optionnel
  specialiteRequise: 'ELECTRICITE' | 'CLIMATISATION' | 'ENVIRONNEMENT';
  nombreTechniciensRequis: number;
}

export interface RendezVous {
  idRendezvous?: number;
  description: string;
  dateRendezVous: string; // Peut être string, Date ou tableau [number, number, number, number, number]
  notificationEnvoyee: boolean;
  administrateur: {
    idUser: number;
    nom: string;
    prenom: string;
    email: string;
    departement?: string;
  };
  techniciens: {
    idUser: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
   
  }[];
}
export interface RendezVousRequest {
  adminId: number;
  description: string;
  date: string; // Format ISO 8601
  technicienIds: number[];
}
export interface SuggestionResponse {
  suggestions: RendezVous[];
  warning?: string;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  details?: any;
}