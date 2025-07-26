export interface Techniciens {
  idUser: number;
  email: string;
  role: string; // Note: In your response, 'role' seems to hold the technician's name (e.g., 'Leroy')
  valide: boolean;
  specialite: 'ELECTRICITE' | 'CLIMATISATION' | 'ENVIRONNEMENT';
  numeroTelephone: string;
  dateDisponibilite: string; // Changed to string to match backend LocalDate
}