import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Chauffeur } from './chauffeur.model';
import { environment } from '../../environnement/environment';

@Injectable({
  providedIn: 'root'
})
export class ChauffeurService {

  private apiUrl = `${environment.apiUrl}/chauffeurs`;
  private cache: Chauffeur[] | null = null;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Chauffeur[]> {
    if (this.cache) return of(this.cache);
    return this.http.get<Chauffeur[]>(this.apiUrl).pipe(tap(data => this.cache = data));
  }

  getById(id: number): Observable<Chauffeur> {
    const cached = this.cache?.find(c => c.id === id);
    if (cached) return of(cached);
    return this.http.get<Chauffeur>(`${this.apiUrl}/${id}`);
  }

  create(chauffeur: Chauffeur): Observable<Chauffeur> {
    return this.http.post<Chauffeur>(this.apiUrl, chauffeur).pipe(tap(() => this.cache = null));
  }

  update(id: number, chauffeur: Chauffeur): Observable<Chauffeur> {
    return this.http.put<Chauffeur>(`${this.apiUrl}/${id}`, chauffeur).pipe(tap(() => this.cache = null));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache = null));
  }
}
