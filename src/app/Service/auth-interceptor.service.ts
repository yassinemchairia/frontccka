// src/app/services/auth-interceptor.service.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { JwtService } from './jwt.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.jwtService.getToken();
    const skipUrls = ['/auth/login', '/auth/register', '/auth/refresh', '/api/password/reset-request', '/api/password/reset'];

    if (token && !skipUrls.some(url => req.url.includes(url))) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.jwtService.destroyTokens();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}