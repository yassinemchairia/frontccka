import { NgModule } from '@angular/core';
import { NbMenuModule, NbLayoutModule, NbSidebarModule, NbCardModule, NbIconModule, NbListModule, NbWindowModule } from '@nebular/theme';
import { ChatComponent } from '../Chat/chat/chat.component';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { NbToastrModule } from '@nebular/theme';
import { UserSelectionDialogComponent } from '../Chat/user-selection-dialog/user-selection-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationToastComponent } from '../Notifications/notification-toast/notification-toast.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ReactiveFormsModule, 
    ThemeModule,
    NbMenuModule,
    NbLayoutModule, 
    NbSidebarModule,
    NbToastrModule.forRoot(),
    NbCardModule, 
    NbIconModule,
    NbListModule,
    NbWindowModule, 
  ],
  declarations: [
    PagesComponent,
    NotificationToastComponent,
    ChatComponent,
    UserSelectionDialogComponent,
  ],
})
export class PagesModule {
}
