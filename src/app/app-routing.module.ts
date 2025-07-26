import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DisponibilitesComponent } from './Calendrier/disponibilites/disponibilites.component';
import { InterventionCalendarComponent }  from './Intervention/intervention-calendar/intervention-calendar.component';
import{InterventionsTechnicienComponent} from'./Intervention/interventions-technicien/interventions-technicien.component';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { PlanificationComponent } from './rendez-vous/planification/planification.component';
import{AjoutHistoriqueComponent} from './Intervention/ajout-historique/ajout-historique.component'
import { TechnicienValidationComponent } from './auth/technicien-validation/technicien-validation.component';
import { AlertesComponent } from './Alert/alertes/alertes.component';
import { AjoutInterventionComponent } from './Intervention/ajout-intervention/ajout-intervention.component';
import{TechnicienStatsComponent} from './Technicien/technicien-stats/technicien-stats.component';
import{AjoutRapportComponent} from './Intervention/ajout-rapport/ajout-rapport.component';
import{ InterventionTechnicienComponent} from './Intervention/intervention-technicien/intervention-technicien.component'
import { DashboardComponent } from './Dashboard/dashboard/dashboard.component';
import { AlertStatisticsComponent } from './Alert/alert-statistics/alert-statistics.component';
import { CapteurMonitoringComponent } from './CapteurMonitoring/capteur-monitoring/capteur-monitoring.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './Service/auth.guard';
import { AdminGuard } from './Service/admin.guard';
import { ProfileComponent } from './auth/Profile/profile/profile.component';
import { ForgotPasswordComponent } from './auth/ForgotPassword/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/ResetPassword/reset-password/reset-password.component';
import { ListeInterventionsComponent } from './Intervention/liste-interventions/liste-interventions.component';
import { SatisfactionStatisticsComponent } from './SatisfactionStatistics/satisfaction-statistics/satisfaction-statistics.component';
import { CostStatisticsComponent } from './Coast/cost-statistics/cost-statistics.component';
import { TimeStatisticsComponent } from './TimeStatistics/time-statistics/time-statistics.component';
import { CapteurStatisticsComponent } from './Capteur/capteur-statistics/capteur-statistics.component';
import { InterventionStatisticsComponent } from './Intervention/intervention-statistics/intervention-statistics.component';
import { TechnicienStatisticsComponent } from './Technicien/technicien-statistics/technicien-statistics.component';
import { NotificationsComponent } from './Notifications/notifications/notifications.component';
import { PasswordResetRequestComponent } from './auth/Password/password-reset-request/password-reset-request.component';
export const routes: Routes = [
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'password-reset-request',
        component:PasswordResetRequestComponent,
        
      },
      
      {
        path: 'password-reset',
        component: ResetPasswordComponent
      },{
        path: 'capteur-monitoring',
        component: CapteurMonitoringComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        canActivate: [AuthGuard]
      },
      
      {
        path: 'Dispo',
        component: DisponibilitesComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'Plan',
        component: PlanificationComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      
      {
        path: 'INterv',
        component: AjoutInterventionComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'validerTechnicien',
        component: TechnicienValidationComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'Dasch',
        component: DashboardComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      
      
      {
        path: 'AlertStat',
        component: AlertStatisticsComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
  path: 'technicien/:id/interventions',
  component: InterventionsTechnicienComponent
},
{ 
    path: 'interventions/:id/rapport', 
    component: AjoutRapportComponent 
  },
  { path: 'historique/ajouter/:id', component: AjoutHistoriqueComponent },
      
      { path: 'technicien-stats/:id', component: TechnicienStatsComponent },
      { path: 'mes-interventions/:idTechnicien', component: InterventionTechnicienComponent },
      
      
      {
        path: 'interventions/:technicienId',component:InterventionCalendarComponent  }
,
{
        path: 'AlertStat',
        component: AlertStatisticsComponent,
        canActivate: [AuthGuard, AdminGuard],

      },{
            path: 'IntervStat',
            component: InterventionStatisticsComponent,
                    canActivate: [AuthGuard, AdminGuard],

          }, {
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

          },{
        path: 'ListeIntervention',
        component: ListeInterventionsComponent,
                canActivate: [AuthGuard, AdminGuard],

      },
      {
        path: 'Alertes',
        component: AlertesComponent,
        canActivate: [AuthGuard, AdminGuard],

      },
      ]
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
    canActivate: [AuthGuard] // Protection globale des pages
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule { }