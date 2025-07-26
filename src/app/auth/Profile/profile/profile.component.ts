// src/app/components/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../Service/auth.service';
import { ProfileService } from '../../../Service/profile.service';
import { JwtService } from '../../../Service/jwt.service';
import { Utilisateur } from '../../../Service/utilisateur.model';
import { Specialite } from '../../../auth/enums';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
}