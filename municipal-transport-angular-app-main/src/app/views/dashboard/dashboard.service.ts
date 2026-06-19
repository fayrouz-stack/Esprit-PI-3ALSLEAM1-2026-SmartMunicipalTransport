import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environnement/environment';

export interface DashboardStats {
  totalVehicules: number;
  vehiculesDispos: number;
  vehiculesDisposPct: number;
  totalVoyages: number;
  totalChauffeurs: number;
  chauffeurActifs: number;
  chauffeurActifsPct: number;
  ponctualite: number;
  horairesAvecRetard: number;
  totalLignes: number;
  totalStations: number;
  totalTickets: number;
  revenuTotal: number;
  ticketsAujourdhui: number;
}

export const EMPTY_STATS: DashboardStats = {
  totalVehicules: 0, vehiculesDispos: 0, vehiculesDisposPct: 0,
  totalVoyages: 0, totalChauffeurs: 0, chauffeurActifs: 0,
  chauffeurActifsPct: 0, ponctualite: 0, horairesAvecRetard: 0,
  totalLignes: 0, totalStations: 0,
  totalTickets: 0, revenuTotal: 0, ticketsAujourdhui: 0,
};

@Injectable({ providedIn: "root" })
export class DashboardService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getVehiculesStats(): Observable<Partial<DashboardStats>> {
    return this.http.get<any[]>(`${this.api}/vehicules`).pipe(
      map(v => ({
        totalVehicules: v.length,
        vehiculesDispos: v.filter((x: any) => x.vehiculeDispo).length,
        vehiculesDisposPct: v.length > 0
          ? Math.round(v.filter((x: any) => x.vehiculeDispo).length / v.length * 100)
          : 0,
      }))
    );
  }

  getVoyagesStats(): Observable<Partial<DashboardStats>> {
    return this.http.get<any[]>(`${this.api}/voyages`).pipe(
      map(v => ({ totalVoyages: v.length }))
    );
  }

  getHorairesStats(): Observable<Partial<DashboardStats>> {
    return this.http.get<any[]>(`${this.api}/horaires`).pipe(
      map(h => {
        const avecRetard = h.filter((x: any) => x.retard_estime && x.retard_estime > 0).length;
        return {
          ponctualite: h.length > 0
            ? Math.round((h.length - avecRetard) / h.length * 100)
            : 0,
          horairesAvecRetard: avecRetard,
        };
      })
    );
  }

  getChauffeurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/chauffeurs`);
  }

  getLignesStats(): Observable<Partial<DashboardStats>> {
    return this.http.get<any[]>(`${this.api}/lignes`).pipe(
      map(l => ({ totalLignes: l.length }))
    );
  }

  getStationsStats(): Observable<Partial<DashboardStats>> {
    return this.http.get<any[]>(`${this.api}/stations`).pipe(
      map(s => ({ totalStations: s.length }))
    );
  }

  getTicketsStats(): Observable<Partial<DashboardStats>> {
    return this.http.get<any>(`${this.api}/tickets/stats`).pipe(
      map(s => ({
        totalTickets: s.totalTickets ?? 0,
        revenuTotal: s.revenuTotal ?? 0,
        ticketsAujourdhui: s.ticketsAujourdhui ?? 0,
      }))
    );
  }
}
