// src/app/models/password-reset-request.model.ts
export interface PasswordResetRequest {
  email: string;
  token: string;
  newPassword: string;
}