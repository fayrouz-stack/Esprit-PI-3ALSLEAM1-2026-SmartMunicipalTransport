import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environnement/environment';
import { Ligne } from './ligne.model';

@Injectable({ providedIn: 'root' })
export class LigneService {
  private apiUrl = `${environment.apiUrl}/lignes`;
  private cache: Ligne[] | null = null;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ligne[]> {
    if (this.cache) return of(this.cache);
    return this.http.get<Ligne[]>(this.apiUrl).pipe(tap(data => this.cache = data));
  }

  getById(id: number): Observable<Ligne> {
    const cached = this.cache?.find(l => l.id === id);
    if (cached) return of(cached);
    return this.http.get<Ligne>(`${this.apiUrl}/${id}`);
  }

  create(ligne: Ligne): Observable<Ligne> {
    return this.http.post<Ligne>(this.apiUrl, ligne).pipe(tap(() => this.cache = null));
  }

  update(id: number, ligne: Ligne): Observable<Ligne> {
    return this.http.put<Ligne>(`${this.apiUrl}/${id}`, ligne).pipe(tap(() => this.cache = null));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache = null));
  }
}