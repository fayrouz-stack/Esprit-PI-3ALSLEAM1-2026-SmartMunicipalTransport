import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environnement/environment';

export interface PositionUpdate {
  id: number;
  latitude: number;
  longitude: number;
  marque?: string;
  modele?: string;
  matriculeFourni?: string;
  etat?: string;
  timestamp?: number;
}

/**
 * Service WebSocket natif (sans SockJS ni STOMP).
 * Se connecte à ws://localhost:8081/ws/positions
 * et diffuse les mises à jour de position en Observable.
 */
@Injectable({ providedIn: 'root' })
export class VehiculeWebSocketService implements OnDestroy {

  private ws: WebSocket | null = null;
  private reconnectTimer: any = null;
  private positionSubject = new Subject<PositionUpdate>();

  /** Observable sur lequel s'abonner pour recevoir les positions en temps réel */
  readonly position$: Observable<PositionUpdate> = this.positionSubject.asObservable();

  connected = false;

  constructor(private zone: NgZone) {
    this.connect();
  }

  private get wsUrl(): string {
    // http://localhost:8081/api → ws://localhost:8081/ws/positions
    return environment.apiUrl.replace(/^http/, 'ws').replace('/api', '') + '/ws/positions';
  }

  private connect(): void {
    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        this.zone.run(() => { this.connected = true; });
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event: MessageEvent) => {
        this.zone.run(() => {
          try {
            const pos: PositionUpdate = JSON.parse(event.data);
            this.positionSubject.next(pos);
          } catch (e) { /* message non JSON */ }
        });
      };

      this.ws.onclose = () => {
        this.zone.run(() => { this.connected = false; });
        // Reconnexion automatique après 5 secondes
        this.reconnectTimer = setTimeout(() => this.connect(), 5000);
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch (e) {
      this.reconnectTimer = setTimeout(() => this.connect(), 5000);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.positionSubject.complete();
  }
}
