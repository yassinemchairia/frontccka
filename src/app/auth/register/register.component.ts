// src/app/components/register/register.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
import { Specialite } from '../../auth/enums';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  specialites = Object.values(Specialite);
  registrationSuccess: boolean = false; // Nouvelle propriété pour suivre l'état

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      numeroTelephone: ['', Validators.required],
      specialite: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Please wait for admin approval.';
          this.errorMessage = '';
          this.registrationSuccess = true; // Mettre à jour l'état
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Registration failed';
          this.successMessage = '';
          this.registrationSuccess = false;
        }
      });
    }
  }
}