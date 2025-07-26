// src/app/components/forgot-password/forgot-password.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetService } from '../../../Service/password-reset.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  requestForm: FormGroup;
  resetForm: FormGroup;
  loading = false;
  email: string | null = null;
 forgotForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  showResetForm: boolean = false;
  resetToken: string = '';
  constructor(
    private fb: FormBuilder,
    private passwordResetService: PasswordResetService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.valid) {
      const email = this.forgotForm.value.email;
      this.passwordResetService.requestPasswordReset(email).subscribe({
        next: () => {
          this.successMessage = 'Password reset link has been sent to your email';
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Failed to send reset link';
          this.successMessage = '';
        }
      });
    }
  }

  
}