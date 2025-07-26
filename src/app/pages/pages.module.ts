import { NgModule } from '@angular/core';
import { NbMenuModule, NbLayoutModule, NbSidebarModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { NbToastrModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';import { NotificationToastComponent } from '../Notifications/notification-toast/notification-toast.component';
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
],
  declarations: [
    PagesComponent,
    NotificationToastComponent
  ],
})
export class PagesModule {
}
