

export interface TechnicienDTO {
  idUser: number;
  nom: string;
  prenom: string;
  specialite: 'ELECTRICITE' | 'CLIMATISATION' | 'ENVIRONNEMENT';  // Enum des spécialités
}
