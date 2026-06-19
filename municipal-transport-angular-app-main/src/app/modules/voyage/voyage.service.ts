import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from './../../environnement/environment';
import { Voyage } from './models/voyage.model';

@Injectable({ providedIn: 'root' })
export class VoyageService {
  private apiUrl = `${environment.apiUrl}/voyages`;
  private cache: Voyage[] | null = null;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Voyage[]> {
    if (this.cache) return of(this.cache);
    return this.http.get<Voyage[]>(this.apiUrl).pipe(tap(data => this.cache = data));
  }

  getById(id: number): Observable<Voyage> {
    const cached = this.cache?.find(v => v.id === id);
    if (cached) return of(cached);
    return this.http.get<Voyage>(`${this.apiUrl}/${id}`);
  }

  create(voyage: any): Observable<Voyage> {
    return this.http.post<Voyage>(this.apiUrl, voyage).pipe(tap(() => this.cache = null));
  }

  update(id: number, voyage: any): Observable<Voyage> {
    return this.http.put<Voyage>(`${this.apiUrl}/${id}`, voyage).pipe(tap(() => this.cache = null));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache = null));
  }

  processPayment(payload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/payments/process`, payload);
  }
}