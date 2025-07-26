// src/app/services/jwt.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor() {}

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  saveTokens(tokenResponse: { accessToken: string; refreshToken: string }): void {
    localStorage.setItem(this.TOKEN_KEY, tokenResponse.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokenResponse.refreshToken);
  }

  destroyTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < (Date.now() / 1000);
    } catch (e) {
      return true;
    }
  }
}