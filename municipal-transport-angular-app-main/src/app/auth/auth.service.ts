import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError, throwError } from 'rxjs';
import { AuthUser, LoginResponse } from './auth.model';
import { environment } from '../environnement/environment';

/** Comptes de démonstration (utilisés si le backend n'a pas encore /api/auth/login) */
const DEMO_ACCOUNTS: Record<string, { password: string; role: string; nom: string; prenom: string }> = {
  'admin@transport.tn':        { password: 'admin123', role: 'ADMIN',        nom: 'Système',   prenom: 'Administrateur' },
  'gestionnaire@transport.tn': { password: 'gest123',  role: 'GESTIONNAIRE', nom: 'Transport', prenom: 'Gestionnaire'   },
};

@Injectable({ providedIn: 'root' })
export class AuthService {

  private http   = inject(HttpClient);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY  = 'jwt_user';
  private readonly DEMO_MODE_KEY = 'demo_mode';
  private demoMode = this.readDemoMode();

  private readDemoMode(): boolean {
    try {
      return localStorage.getItem(this.DEMO_MODE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  private setDemoMode(value: boolean): void {
    this.demoMode = value;
    try {
      if (value) {
        localStorage.setItem(this.DEMO_MODE_KEY, 'true');
      } else {
        localStorage.removeItem(this.DEMO_MODE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }

  /** Appelle POST /api/auth/login. Si le backend répond 404/0, bascule sur le mode démo. */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(res => {
          this.setDemoMode(false);
          localStorage.setItem(this.TOKEN_KEY, res.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify({
            email: res.email, role: res.role,
            nom: res.nom,     prenom: res.prenom
          }));
        }),
        catchError(err => {
          // Fallback démo : si le backend n'a pas encore l'endpoint auth (404 / pas de réseau)
          if (err.status === 404 || err.status === 0) {
            this.setDemoMode(true);
            return this._demoLogin(email, password);
          }
          return throwError(() => err);
        })
      );
  }

  /** Login local pour la démo (pas d'appel réseau). */
  private _demoLogin(email: string, password: string): Observable<LoginResponse> {
    const account = DEMO_ACCOUNTS[email];
    if (!account || account.password !== password) {
      return throwError(() => ({ status: 401, error: { error: 'Email ou mot de passe incorrect' } }));
    }
    const now     = Math.floor(Date.now() / 1000);
    const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: email, role: account.role, iat: now, exp: now + 86400 }));
    const token   = `${header}.${payload}.demo`;
    const res: LoginResponse = { token, email, role: account.role, nom: account.nom, prenom: account.prenom };
    this.setDemoMode(true);
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify({ email, role: account.role, nom: account.nom, prenom: account.prenom }));
    return of(res);
  }

  logout(): void {
    this.setDemoMode(false);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Vérifie que le token existe et n'est pas expiré (décodage base64 du payload JWT) */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      // Convertir base64url → base64 standard avant atob()
      const b64 = token.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const padded = b64 + '='.repeat((4 - b64.length % 4) % 4);
      const payload = JSON.parse(atob(padded));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  isDemoMode(): boolean {
    return this.demoMode;
  }

  getRole(): string | null {
    return this.getUser()?.role ?? null;
  }

  isAdmin(): boolean        { return this.getRole() === 'ADMIN'; }
  isGestionnaire(): boolean { return this.getRole() === 'GESTIONNAIRE'; }
  isChauffeur(): boolean    { return this.getRole() === 'CHAUFFEUR'; }

  /** Retourne 'Prénom Nom' ou email si nom non disponible */
  getDisplayName(): string {
    const u = this.getUser();
    if (!u) return '';
    return u.prenom && u.nom ? `${u.prenom} ${u.nom}` : u.email;
  }
}
