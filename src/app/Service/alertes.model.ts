import { Capteur } from "./capteur.model";

export interface Alertes {
  idAlerte: number;
  capteur: Capteur;
  typePanne: string;
  niveauGravite: string;
  dateAlerte: string;
  dateResolution: string;
  description: string;
  estResolu: boolean;
  valeurDeclenchement: number;
}