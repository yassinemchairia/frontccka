import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './Service/auth-interceptor.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { MatSortModule } from '@angular/material/sort';

import { AuthGuard } from './Service/auth.guard';
import { AdminGuard } from './Service/admin.guard';
import { AuthService } from './Service/auth.service';
import { ProfileService } from './Service/profile.service';
import { TokenInterceptor } from './Service/token.interceptor';
import { NbChatModule, NbDatepickerModule, NbDialogModule, NbMenuModule, NbSidebarModule, NbToastrModule, NbWindowModule, NbCardModule, NbSelectModule, NbListModule, NbIconModule } from '@nebular/theme';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormsModule } from '@angular/forms';
import { TechnicienValidationComponent } from './auth/technicien-validation/technicien-validation.component';
import { AlertesComponent } from './Alert/alertes/alertes.component';
import { DisponibilitesComponent } from './Calendrier/disponibilites/disponibilites.component';
import { CalendarModule, DateAdapter, ɵCalendarDatePipe } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AjoutInterventionComponent } from './Intervention/ajout-intervention/ajout-intervention.component';
import { TechnicienStatsComponent } from './Technicien/technicien-stats/technicien-stats.component';
import { NgChartsModule } from 'ng2-charts';
import { MatDividerModule } from '@angular/material/divider';

import { InterventionTechnicienComponent } from './Intervention/intervention-technicien/intervention-technicien.component';
import { InterventionCalendarComponent } from './Intervention/intervention-calendar/intervention-calendar.component';
import { InterventionsTechnicienComponent } from './Intervention/interventions-technicien/interventions-technicien.component';
import { AjoutRapportComponent } from './Intervention/ajout-rapport/ajout-rapport.component';
import { AjoutHistoriqueComponent } from './Intervention/ajout-historique/ajout-historique.component';
import { ListeInterventionsComponent } from './Intervention/liste-interventions/liste-interventions.component';
import { HistoriqueListComponent } from './Intervention/historique/historique-list/historique-list.component';
import { DashboardComponent } from './Dashboard/dashboard/dashboard.component';
import { AlertStatisticsComponent } from './Alert/alert-statistics/alert-statistics.component';
import { InterventionStatisticsComponent } from './Intervention/intervention-statistics/intervention-statistics.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TechnicienStatisticsComponent } from './Technicien/technicien-statistics/technicien-statistics.component';
import { CapteurStatisticsComponent } from './Capteur/capteur-statistics/capteur-statistics.component';
import { CostStatisticsComponent } from './Coast/cost-statistics/cost-statistics.component';
import { TimeStatisticsComponent } from './TimeStatistics/time-statistics/time-statistics.component';
import { SatisfactionStatisticsComponent } from './SatisfactionStatistics/satisfaction-statistics/satisfaction-statistics.component';
import { CapteurMonitoringComponent } from './CapteurMonitoring/capteur-monitoring/capteur-monitoring.component';
import { PlanificationComponent } from './rendez-vous/planification/planification.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { DateArrayPipe } from '../app/Service/date-array.pipe';
import { NotificationsComponent } from './Notifications/notifications/notifications.component';
import { TechnicienStats1Component } from './TechnicienStats1/technicien-stats1/technicien-stats1.component';
import { TechnicienGuard } from './Service/technicien.guard';
import { RapportTechnicienComponent } from './Rapport/rapport-technicien/rapport-technicien.component';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common'; // For ngIf, ngFor, and pipes like currency
import { NbThemeModule, NbLayoutModule, NbAlertModule, NbSpinnerModule, NbFormFieldModule, NbInputModule, NbButtonModule } from '@nebular/theme';
import { GestionDisponibilitesComponent } from './GestionDisponibilites/gestion-disponibilites/gestion-disponibilites.component';
import { PredictionModalComponent } from './Prediction/prediction-modal/prediction-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ResolvedAiAlertsComponent } from './ResolvedAiAlerts/resolved-ai-alerts/resolved-ai-alerts.component';
import { InterventionDetailsModalComponent } from './yy/intervention-details-modal/intervention-details-modal.component';
import { PasswordResetRequestComponent } from './auth/Password/password-reset-request/password-reset-request.component';
import { ResetPasswordComponent } from './auth/ResetPassword/reset-password/reset-password.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RendezVousListComponent } from './rendez-vous/rendez-vous-list/rendez-vous-list.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    TechnicienValidationComponent,
    AlertesComponent,
    
    DisponibilitesComponent,
    AjoutInterventionComponent,
    TechnicienStatsComponent,
    InterventionTechnicienComponent,
    InterventionCalendarComponent,
    InterventionsTechnicienComponent,
    AjoutRapportComponent,
    AjoutHistoriqueComponent,
    ListeInterventionsComponent,
    HistoriqueListComponent,
    DashboardComponent,
    
    AlertStatisticsComponent,
    InterventionStatisticsComponent,
    TechnicienStatisticsComponent,
    CapteurStatisticsComponent,
    CostStatisticsComponent,
    TimeStatisticsComponent,
    SatisfactionStatisticsComponent,
    CapteurMonitoringComponent,
    PlanificationComponent,
    DateArrayPipe,
    NotificationsComponent,
    TechnicienStats1Component,
    RapportTechnicienComponent,
    GestionDisponibilitesComponent,
    PredictionModalComponent,
    ResolvedAiAlertsComponent,
    InterventionDetailsModalComponent,
    PasswordResetRequestComponent,
    ResetPasswordComponent,
    RendezVousListComponent

  ],
  imports: [
    BrowserModule,
    CommonModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    NbEvaIconsModule,
        MatSortModule,

    FormsModule,
     NbAlertModule,
    NbSpinnerModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    MatSnackBarModule,
    HttpClientModule,
    NbFormFieldModule,
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
        messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    ReactiveFormsModule,
    CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
    }),
    MatButtonToggleModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    NgChartsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NbCardModule,
    NbSelectModule,
    NbListModule,
    NbIconModule
],
  providers: [
    ɵCalendarDatePipe,
    DatePipe,
    AuthService,
    ProfileService,
    AuthGuard,
    AdminGuard,
    TechnicienGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, // Gardez votre intercepteur existant
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor, // Ajoutez le nouvel intercepteur
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}