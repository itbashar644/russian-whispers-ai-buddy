
export interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
}

export interface PasswordUpdateResult extends AuthResult {
  error?: string | { message?: string };
}

export interface ResetPasswordParams {
  accessToken: string;
  password: string;
}
