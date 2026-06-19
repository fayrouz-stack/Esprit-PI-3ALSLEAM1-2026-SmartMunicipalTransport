export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: string;
  nom: string;
  prenom: string;
}

export interface AuthUser {
  email: string;
  role: string;
  nom: string;
  prenom: string;
}

export type UserRole = 'ADMIN' | 'GESTIONNAIRE' | 'CHAUFFEUR';
