import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AlertesComponent } from '../Alert/alertes/alertes.component'; // ou le bon chemin
import { ListeInterventionsComponent } from '../Intervention/liste-interventions/liste-interventions.component';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { DisponibilitesComponent } from '../Calendrier/disponibilites/disponibilites.component';
import { TechnicienValidationComponent} from '../auth/technicien-validation/technicien-validation.component';
import { AlertStatisticsComponent } from '../Alert/alert-statistics/alert-statistics.component';
import { InterventionStatisticsComponent } from '../Intervention/intervention-statistics/intervention-statistics.component';
import { CapteurStatisticsComponent } from '../Capteur/capteur-statistics/capteur-statistics.component';
import { TechnicienStatisticsComponent } from '../Technicien/technicien-statistics/technicien-statistics.component';
import { CostStatisticsComponent } from '../Coast/cost-statistics/cost-statistics.component';
import {TimeStatisticsComponent} from '../TimeStatistics/time-statistics/time-statistics.component';
import{SatisfactionStatisticsComponent} from '../SatisfactionStatistics/satisfaction-statistics/satisfaction-statistics.component'
import { PlanificationComponent } from '../rendez-vous/planification/planification.component';
import { LoginComponent } from '../auth/login/login.component';
import { CapteurMonitoringComponent } from '../CapteurMonitoring/capteur-monitoring/capteur-monitoring.component';
import { NotificationsComponent } from '../Notifications/notifications/notifications.component';
import { AuthGuard } from '../Service/auth.guard';
import { AdminGuard } from '../Service/admin.guard';
import { TechnicienStats1Component } from '../TechnicienStats1/technicien-stats1/technicien-stats1.component';
import { InterventionTechnicienComponent } from '../Intervention/intervention-technicien/intervention-technicien.component';
import { RapportTechnicienComponent } from '../Rapport/rapport-technicien/rapport-technicien.component';
import { GestionDisponibilitesComponent } from '../GestionDisponibilites/gestion-disponibilites/gestion-disponibilites.component';
import { ResolvedAiAlertsComponent } from '../ResolvedAiAlerts/resolved-ai-alerts/resolved-ai-alerts.component';
import { RendezVousListComponent } from '../rendez-vous/rendez-vous-list/rendez-vous-list.component';
import { ChatComponent } from '../Chat/chat/chat.component'; // Importez le nouveau composant
const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'chat', // Nouvelle route pour le chat
      component: ChatComponent,
      canActivate: [AuthGuard], // Protégé par AuthGuard
    },
    {
      path: 'notifications',
      component: NotificationsComponent,

    },
    {
      path: 'gestion-disponibilites',
      component: GestionDisponibilitesComponent,
      canActivate: [AuthGuard], // Accessible aux techniciens et admins
    },
    {
      path: 'mes_rendez_vous',
      component:  RendezVousListComponent,
      canActivate: [AuthGuard], // Accessible aux techniciens et admins
    },
    {
      path: 'rapports/:idTechnicien', // New route for reports
      component: RapportTechnicienComponent,
      canActivate: [AuthGuard],
    },
    { path: 'technicien-stats', component: TechnicienStats1Component, canActivate: [AuthGuard] }, // Updated route
    {
            path: 'AlertStat',
            component: AlertStatisticsComponent,
                  canActivate: [AuthGuard, AdminGuard],

          },
           {
            path: 'resolved',
            component: ResolvedAiAlertsComponent,
                  canActivate: [AuthGuard, AdminGuard],

          },
          
       {
            path: 'IntervStat',
            component: InterventionStatisticsComponent,
                  canActivate: [AuthGuard, AdminGuard],

          }, 
          {
      path: 'interventions/:idTechnicien', // This is the new route
      component: InterventionTechnicienComponent,
      canActivate: [AuthGuard], // Protect this route
    },
          {
            path: 'login',
            component: LoginComponent,
          },
          {
            path: 'TechStat',
            component: TechnicienStatisticsComponent,
                  canActivate: [AuthGuard, AdminGuard],

          },  
          {
            path: 'CaptStat',
            component: CapteurStatisticsComponent,
                  canActivate: [AuthGuard, AdminGuard],

          }, 
          {
            path: 'TimeStat',
            component:  TimeStatisticsComponent,
                  canActivate: [AuthGuard, AdminGuard],

          }, 
           {
            path: 'COASTStat',
            component:  CostStatisticsComponent,
                  canActivate: [AuthGuard, AdminGuard],

          }, 
          {
            path: 'SatisStat',
            component:  SatisfactionStatisticsComponent,
                  canActivate: [AuthGuard, AdminGuard],

          }, 
          {
            path: 'Rend',
            component:  PlanificationComponent,
                  canActivate: [AuthGuard, AdminGuard],

          }, 
          {
                  path: 'capteur-monitoring',
                  component: CapteurMonitoringComponent,
                        canActivate: [AuthGuard, AdminGuard],

                },
          

    {
      path: 'alertes',
      component: AlertesComponent,
      canActivate: [AuthGuard, AdminGuard],
      
    },
    {
      path: 'Calendrier',
      component: DisponibilitesComponent,
            canActivate: [AuthGuard, AdminGuard],

    },
    {
        path: 'validerTechnicien',
        component: TechnicienValidationComponent,
              canActivate: [AuthGuard, AdminGuard],

      },
      {
        path: 'ListeIntervention',
        component: ListeInterventionsComponent,
              canActivate: [AuthGuard, AdminGuard],

      },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: 'forms',
      loadChildren: () => import('./forms/forms.module')
        .then(m => m.FormsModule),
    },
    {
      path: 'ui-features',
      loadChildren: () => import('./ui-features/ui-features.module')
        .then(m => m.UiFeaturesModule),
    },
    {
      path: 'modal-overlays',
      loadChildren: () => import('./modal-overlays/modal-overlays.module')
        .then(m => m.ModalOverlaysModule),
    },
    {
      path: 'extra-components',
      loadChildren: () => import('./extra-components/extra-components.module')
        .then(m => m.ExtraComponentsModule),
    },
    {
      path: 'maps',
      loadChildren: () => import('./maps/maps.module')
        .then(m => m.MapsModule),
    },
    {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module')
        .then(m => m.ChartsModule),
    },
    {
      path: 'editors',
      loadChildren: () => import('./editors/editors.module')
        .then(m => m.EditorsModule),
    },
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
