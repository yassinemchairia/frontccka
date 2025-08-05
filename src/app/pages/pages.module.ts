import { NgModule } from '@angular/core';
import { NbMenuModule, NbLayoutModule, NbSidebarModule, NbCardModule, NbIconModule, NbListModule } from '@nebular/theme';
import { ChatComponent } from '../Chat/chat/chat.component'; // Importez le nouveau composant
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { NbToastrModule } from '@nebular/theme';
import { UserSelectionDialogComponent } from '../Chat/user-selection-dialog/user-selection-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';import { NotificationToastComponent } from '../Notifications/notification-toast/notification-toast.component';
import { NbLayoutColumnModule } from '@nebular/theme';

@NgModule({
  imports: [
    PagesRoutingModule,
    ReactiveFormsModule, // Required for reactive forms
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    NbLayoutModule,
    NbSidebarModule,
    NbToastrModule.forRoot(),
    NbCardModule,
    NbIconModule,
    NbListModule,
    NbLayoutColumnModule
],
  declarations: [
    PagesComponent,
    NotificationToastComponent,
    ChatComponent,
        UserSelectionDialogComponent

  ],
})
export class PagesModule {
}
