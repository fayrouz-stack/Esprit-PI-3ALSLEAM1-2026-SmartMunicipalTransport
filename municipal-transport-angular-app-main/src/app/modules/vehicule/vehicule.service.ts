<<<<<<< HEAD
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environnement/environment';
import { Vehicule } from './vehicule.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl = `${environment.apiUrl}/vehicules`;
  private cache: Vehicule[] | null = null;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Vehicule[]> {
    if (this.cache) return of(this.cache);
    return this.http.get<Vehicule[]>(this.apiUrl).pipe(tap(data => this.cache = data));
  }

  getById(id: number): Observable<Vehicule> {
    const cached = this.cache?.find(v => v.id === id);
    if (cached) return of(cached);
    return this.http.get<Vehicule>(`${this.apiUrl}/${id}`);
  }

  create(vehicule: Vehicule): Observable<Vehicule> {
    return this.http.post<Vehicule>(this.apiUrl, vehicule).pipe(tap(() => this.cache = null));
  }

  update(id: number, vehicule: Vehicule): Observable<Vehicule> {
    return this.http.put<Vehicule>(`${this.apiUrl}/${id}`, vehicule).pipe(tap(() => this.cache = null));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache = null));
  }
=======
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environnement/environment';
import { Vehicule } from './vehicule.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl = `${environment.apiUrl}/vehicules`;
  private cache: Vehicule[] | null = null;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Vehicule[]> {
    if (this.cache) return of(this.cache);
    return this.http.get<Vehicule[]>(this.apiUrl).pipe(tap(data => this.cache = data));
  }

  getById(id: number): Observable<Vehicule> {
    const cached = this.cache?.find(v => v.id === id);
    if (cached) return of(cached);
    return this.http.get<Vehicule>(`${this.apiUrl}/${id}`);
  }

  create(vehicule: Vehicule): Observable<Vehicule> {
    return this.http.post<Vehicule>(this.apiUrl, vehicule).pipe(tap(() => this.cache = null));
  }

  update(id: number, vehicule: Vehicule): Observable<Vehicule> {
    return this.http.put<Vehicule>(`${this.apiUrl}/${id}`, vehicule).pipe(tap(() => this.cache = null));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache = null));
  }
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}