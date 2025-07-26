// src/app/models/registration-request.model.ts
import { Specialite } from '../auth/enums';

export interface RegistrationRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  numeroTelephone: string;
  specialite: Specialite;
}