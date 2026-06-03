import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environnement/environment';
import { Station } from './station.model';

@Injectable({ providedIn: 'root' })
export class StationService {
  private apiUrl = `${environment.apiUrl}/stations`;
  private cache: Station[] | null = null;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Station[]> {
    if (this.cache) return of(this.cache);
    return this.http.get<Station[]>(this.apiUrl).pipe(tap(data => this.cache = data));
  }

  getById(id: number): Observable<Station> {
    const cached = this.cache?.find(s => s.id === id);
    if (cached) return of(cached);
    return this.http.get<Station>(`${this.apiUrl}/${id}`);
  }

  create(station: Station): Observable<Station> {
    return this.http.post<Station>(this.apiUrl, station).pipe(tap(() => this.cache = null));
  }

  update(id: number, station: Station): Observable<Station> {
    return this.http.put<Station>(`${this.apiUrl}/${id}`, station).pipe(tap(() => this.cache = null));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache = null));
  }
}