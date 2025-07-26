import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { LoadingInterceptor } from './loading.interceptor';
import { LoaderService } from './loader.service';
import { LoaderComponent } from './Loader/loader/loader.component';
import { ProfileComponent } from './Profile/profile/profile.component';
import { ForgotPasswordComponent } from './ForgotPassword/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './ResetPassword/reset-password/reset-password.component';
import { PasswordResetRequestComponent } from './Password/password-reset-request/password-reset-request.component';

@NgModule({
  declarations: [
    LoaderComponent,
    ProfileComponent,
    ForgotPasswordComponent
    
  ],
  imports: [CommonModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    LoaderService
  ]
})
export class CoreModule {}