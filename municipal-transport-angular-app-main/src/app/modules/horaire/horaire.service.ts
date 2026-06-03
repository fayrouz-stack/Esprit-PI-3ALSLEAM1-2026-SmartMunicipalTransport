import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environnement/environment';
import { Horaire } from './horaire.model';

@Injectable({ providedIn: 'root' })
export class HoraireService {
  private apiUrl = `${environment.apiUrl}/horaires`;
  private cache: Horaire[] | null = null;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Horaire[]> {
    if (this.cache) return of(this.cache);
    return this.http.get<Horaire[]>(this.apiUrl).pipe(tap(data => this.cache = data));
  }

  getById(id: number): Observable<Horaire> {
    const cached = this.cache?.find(h => h.id === id);
    if (cached) return of(cached);
    return this.http.get<Horaire>(`${this.apiUrl}/${id}`);
  }

  create(horaire: Horaire): Observable<Horaire> {
    return this.http.post<Horaire>(this.apiUrl, horaire).pipe(tap(() => this.cache = null));
  }

  update(id: number, horaire: Horaire): Observable<Horaire> {
    return this.http.put<Horaire>(`${this.apiUrl}/${id}`, horaire).pipe(tap(() => this.cache = null));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache = null));
  }
}