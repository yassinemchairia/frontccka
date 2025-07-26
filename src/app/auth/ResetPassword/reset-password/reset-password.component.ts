import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../Service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  email: string = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'] || '';
    this.token = this.route.snapshot.queryParams['token'] || '';
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetForm.valid && this.email && this.token) {
      this.errorMessage = '';
      this.successMessage = '';
      const { newPassword } = this.resetForm.value;
      this.authService.resetPassword(this.email, this.token, newPassword).subscribe({
        next: () => {
          this.successMessage = 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.';
          setTimeout(() => this.router.navigate(['/auth/login']), 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Une erreur est survenue. Le lien peut être invalide ou expiré.';
        }
      });
    }
  }
}