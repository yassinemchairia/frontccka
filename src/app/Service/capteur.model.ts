export interface Capteur {
  idCapt: number;
  ipAdresse: string;
  emplacement: string;
  departement: string;
  type: string;
  valeurActuelle: number;
  etatElectricite: string;
  derniereMiseAJour: Date; // Changé de string à Date
  uniteMesure: string;
}