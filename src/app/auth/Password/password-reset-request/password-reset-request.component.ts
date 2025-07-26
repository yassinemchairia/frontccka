import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../Service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.scss']
})
export class PasswordResetRequestComponent {
  resetForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      this.errorMessage = '';
      this.successMessage = '';
      const { email } = this.resetForm.value;
      this.authService.requestPasswordReset(email).subscribe({
        next: () => {
          this.successMessage = 'Un e-mail de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception.';
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        }
      });
    }
  }
}
