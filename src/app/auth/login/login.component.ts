import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.isLoading = false;
          // La redirection est gérée dans AuthService
        },
        error: (err) => {
          console.error('Login error:', err);
          this.isLoading = false;
          this.errorMessage = err.error?.message || err.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.';
          this.loginForm.reset(); // Réinitialiser le formulaire après un échec
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }
}
