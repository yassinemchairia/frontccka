export interface Notification {
  idNotification: number;
  utilisateur: { idUser: number };
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  intervention?: { idIntervention: number };
  rendezVous?: { idRendezVous: number };
  alerte?: { idAlerte: number };
}

export enum NotificationType {
  INTERVENTION_ASSIGNED = 'INTERVENTION_ASSIGNED',
  APPOINTMENT_ASSIGNED = 'APPOINTMENT_ASSIGNED',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  INTERVENTION_PENDING = 'INTERVENTION_PENDING',
  INTERVENTION_COMPLETED = 'INTERVENTION_COMPLETED',
  NEW_ALERT_GENERATED = 'NEW_ALERT_GENERATED',
  TECHNICIAN_UNAVAILABLE = 'TECHNICIAN_UNAVAILABLE',
  REPORT_SUBMITTED = 'REPORT_SUBMITTED',
  HIGH_PRIORITY_ALERT = 'HIGH_PRIORITY_ALERT',
  CAPTEUR_ALERT = 'CAPTEUR_ALERT',
  DISPONIBILITY_UPDATED = 'DISPONIBILITY_UPDATED',
  INTERVENTION_STATUS_CHANGED = 'INTERVENTION_STATUS_CHANGED',
  LowSatisfactionScore = 'LowSatisfactionScore'
}