import { NbMenuItem } from '@nebular/theme';
import { Role } from '../auth/enums';

export const ADMIN_MENU_ITEMS: NbMenuItem[] = [
  
  {
    title: 'Alertes',
    icon: 'alert-triangle-outline',
    link: '/pages/alertes',
  },
  {
    title: 'Mes Rendez-vous',
    icon: 'alert-triangle-outline',
    link: '/pages/mes_rendez_vous',
  },
  {
    title: 'Capteur Monitoring',
    icon: 'bar-chart-outline',
    link: '/pages/capteur-monitoring',
  },
  {
    title: 'ResolvedAiAlerts',
    icon: 'bar-chart-outline',
    link: '/pages/resolved',
  },
  {
    title: 'Rendez-vous',
    icon: 'calendar-outline',
    link: '/pages/Rend',
  },
  {
    title: 'Calendrier',
    icon: 'calendar-outline',
    link: '/pages/Calendrier',
  },
  {
    title: 'Validation Technicien',
    icon: 'checkmark-circle-outline',
    link: '/pages/validerTechnicien',
  },
  {
    title: 'Notifications',
    icon: 'bell-outline',
    link: '/pages/notifications',
    badge: {
      text: '0',
      status: 'danger',
    },
  },
  {
    title: 'Liste des Interventions',
    icon: 'list-outline',
    link: '/pages/ListeIntervention',
  },
  {
    title: 'STATISTIQUES',
    group: true,
  },
  {
    title: 'Vue d\'ensemble Statistiques',
    icon: 'pie-chart-outline',
    children: [
      {
        title: 'Statistiques Alertes',
        link: '/pages/AlertStat',
      },
      {
        title: 'Statistiques Techniciens',
        link: '/pages/TechStat',
      },
      {
        title: 'Statistiques Capteurs',
        link: '/pages/CaptStat',
      },
      {
        title: 'Statistiques Coûts',
        link: '/pages/COASTStat',
      },
      {
        title: 'Statistiques Satisfaction',
        link: '/pages/SatisStat',
      },
      {
        title: 'Statistiques Temps',
        link: '/pages/TimeStat',
      },
      {
        title: 'Statistiques Interventions',
        link: '/pages/IntervStat',
      },
    ],
  },
];

export const TECHNICIAN_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'IoT Dashboard',
    icon: 'home-outline',
    link: '/pages/iot-dashboard',
  },
  {
    title: 'Mon profil',
    icon: 'person-outline',
    link: '/pages/technicien-stats',
  },
  {
    title: 'Mes Rendez-vous',
    icon: 'alert-triangle-outline',
    link: '/pages/mes_rendez_vous',
  },
  {
    title: 'Mes Interventions',
    icon: 'briefcase-outline',
    link: '',
    data: {
      isDynamicLink: true,
      basePath: '/pages/interventions',
    },
  },
  {
    title: 'Mes Rapports',
    icon: 'file-text-outline',
    link: '',
    data: {
      isDynamicLink: true,
      basePath: '/pages/rapports',
    },
  },
  {
    title: 'Notifications',
    icon: 'bell-outline',
    link: '/pages/notifications',
    badge: {
      text: '0',
      status: 'danger',
    },
  },
  {
    title: 'Gestion des Disponibilités',
    icon: 'calendar-outline',
    link: '/pages/gestion-disponibilites',
  },
];

export const AUTH_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'AUTHENTIFICATION',
    group: true,
  },
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Deconnecter',
        link: '/auth/login',
      },
     
    ],
  },
];

export function getMenuItemsByRole(role: Role): NbMenuItem[] {
  switch (role) {
    case Role.ADMIN:
      return [...ADMIN_MENU_ITEMS, ...AUTH_MENU_ITEMS];
    case Role.TECHNICIEN:
      return [...TECHNICIAN_MENU_ITEMS, ...AUTH_MENU_ITEMS];
    default:
      return [...AUTH_MENU_ITEMS];
  }
}

export { Role };
