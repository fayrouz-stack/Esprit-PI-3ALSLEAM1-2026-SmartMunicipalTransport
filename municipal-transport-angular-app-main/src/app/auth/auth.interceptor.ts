import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Injecte automatiquement "Authorization: Bearer <token>" sur chaque requête HTTP.
 * Si le serveur répond 401 (sauf sur /auth/login), déconnecte et redirige vers /login.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // Ne pas appeler logout() sur un 401 venant du login lui-même
        if (err.status === 401 && !req.url.includes('/auth/login')) {
          this.authService.logout();
        }
        return throwError(() => err);
      })
    );
  }
}
