import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environnement/environment';
import { IncidentAlert } from './incident.model';

@Injectable({ providedIn: 'root' })
export class IncidentService {
  private apiUrl = `${environment.apiUrl}/alertes`;

  constructor(private http: HttpClient) {}

  reportCameraAlert(payload: {
    voyageId: number;
    type: string;
    summary: string;
    imageData?: string | null;
  }): Observable<IncidentAlert> {
    return this.http.post<IncidentAlert>(`${this.apiUrl}/camera`, payload);
  }

  getAlerts(): Observable<IncidentAlert[]> {
    return this.http.get<IncidentAlert[]>(this.apiUrl);
  }
}
