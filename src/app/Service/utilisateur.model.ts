import { Role, Specialite, StatutTechnicien } from '../auth/enums';

export interface Utilisateur {
    idUser?: number;
    nom: string;
    prenom: string;
    email: string;
    motDePasse?: string;  // Mot de passe optionnel
    role: Role;
    resetPasswordToken?: string;
    resetPasswordTokenExpiry?: Date;

  }
  
export interface Technicien extends Utilisateur {
  specialite: Specialite;
  numeroTelephone: string;
  dateDisponibilite?: Date;
}

export interface Admin extends Utilisateur {
  departement?: string;
}


export interface AuthenticationRequest {
  email: string;
  motDePasse: string;
}