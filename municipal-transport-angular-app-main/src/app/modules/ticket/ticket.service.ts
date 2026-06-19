import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Ticket, TicketStats, TicketValidateResult } from './ticket.model';
import { environment } from '../../environnement/environment';

@Injectable({ providedIn: 'root' })
export class TicketService {

  private apiUrl = `${environment.apiUrl}/tickets`;
  private http = inject(HttpClient);
  private cache: Ticket[] | null = null;

  getAll(): Observable<Ticket[]> {
    if (this.cache) return of(this.cache);
    return this.http.get<Ticket[]>(this.apiUrl).pipe(tap(data => this.cache = data));
  }

  getById(id: number): Observable<Ticket> {
    const cached = this.cache?.find(t => t.id === id);
    if (cached) return of(cached);
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  create(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket).pipe(tap(() => this.cache = null));
  }

  update(id: number, ticket: Ticket): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, ticket).pipe(tap(() => this.cache = null));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.cache = null));
  }

  getStats(): Observable<TicketStats> {
    return this.http.get<TicketStats>(`${this.apiUrl}/stats`);
  }

  /**
   * Appelle POST /api/tickets/validate
   * Marque le ticket comme UTILISE côté backend.
   * Invalide le cache local.
   */
  validate(ticketId: number): Observable<TicketValidateResult> {
    return this.http
      .post<TicketValidateResult>(`${this.apiUrl}/validate`, { ticketId })
      .pipe(tap(() => this.cache = null));
  }
}
