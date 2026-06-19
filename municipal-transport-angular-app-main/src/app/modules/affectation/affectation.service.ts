import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environnement/environment';
<<<<<<< HEAD
import { Affectation, AutoAssignRequest } from './affectation.model';
=======
import { Affectation } from './affectation.model';
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced

@Injectable({ providedIn: 'root' })
export class AffectationService {

  private apiUrl = `${environment.apiUrl}/affectations`;
  private http = inject(HttpClient);
  private cache: Affectation[] | null = null;

  getAll(): Observable<Affectation[]> {
    if (this.cache) return of(this.cache);
    return this.http.get<Affectation[]>(this.apiUrl).pipe(tap(data => this.cache = data));
  }

  getById(id: number): Observable<Affectation> {
    const cached = this.cache?.find(a => a.id === id);
    if (cached) return of(cached);
    return this.http.get<Affectation>(`${this.apiUrl}/${id}`);
  }

  create(a: Affectation): Observable<Affectation> {
    return this.http.post<Affectation>(this.apiUrl, a).pipe(tap(() => this.cache = null));
  }

  update(id: number, a: Affectation): Observable<Affectation> {
    return this.http.put<Affectation>(`${this.apiUrl}/${id}`, a).pipe(tap(() => this.cache = null));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache = null));
  }

  getPlanning(debut: string, fin: string): Observable<Affectation[]> {
    const params = new HttpParams()
      .set('debut', debut)
      .set('fin', fin);
    return this.http.get<Affectation[]>(`${this.apiUrl}/planning`, { params });
  }
<<<<<<< HEAD

  /**
   * Lance l'auto-affectation côté backend :
   * trouve chauffeur + véhicule disponibles, crée et retourne l'affectation.
   */
  autoAssign(req: AutoAssignRequest): Observable<Affectation> {
    return this.http
      .post<Affectation>(`${this.apiUrl}/auto`, req)
      .pipe(tap(() => this.cache = null));
  }
=======
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}
