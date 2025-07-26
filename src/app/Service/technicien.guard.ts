// src/app/Service/technicien.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TechnicienGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUserRole$.pipe(
      take(1), // Take only the first emission to complete the observable
      map(role => {
        const isTechnicien = this.authService.isLoggedIn() && role === 'TECHNICIEN';
        if (!isTechnicien) {
          this.router.navigate(['/pages']);
        }
        return isTechnicien;
      })
    );
  }
}