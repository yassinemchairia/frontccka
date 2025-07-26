export interface Alerte {
  idAlerte: number;
  typePanne: string;
  niveauGravite: string;
  dateAlerte: string;
  estResolu: boolean;
  idCapteur: number;
  ipAdresse: string;
  emplacement: string;
  typeCapteur: string;
  valeurDeclenchement?: number;
  description?: string;
}