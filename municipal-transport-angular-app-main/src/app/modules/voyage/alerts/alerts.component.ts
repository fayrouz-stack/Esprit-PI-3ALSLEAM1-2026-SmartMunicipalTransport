import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BadgeModule, ButtonModule, CardModule, TableModule } from '@coreui/angular';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { IncidentService } from '../../incident/incident.service';
import { AuthService } from '../../../auth/auth.service';
import { VoyageService } from '../voyage.service';
import { IncidentAlert } from '../../incident/incident.model';
import { Voyage } from '../models/voyage.model';

interface VoyageAlert extends IncidentAlert {
  voyage?: Voyage;
  detectionTime: string;
}

@Component({
  selector: 'app-voyage-alerts',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, TableModule, BadgeModule, ButtonModule],
  templateUrl: './alerts.component.html'
})
export class AlertsComponent implements OnInit {
  public alerts: VoyageAlert[] = [];
  public loading = false;
  public error = '';

  constructor(
    private incidentService: IncidentService,
    private voyageService: VoyageService,
    public authService: AuthService
  ) {}

  private scheduleStateUpdate(fn: () => void): void {
    Promise.resolve().then(fn);
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      Promise.resolve().then(() => void this.loadAlerts());
    } else {
      this.error = 'Connectez‑vous pour afficher les alertes.';
    }
  }

  public async loadAlerts(): Promise<void> {
    this.loading = true;
    this.error = '';

    if (!this.authService.isLoggedIn()) {
      this.scheduleStateUpdate(() => {
        this.loading = false;
        this.error = 'Session expirée. Veuillez vous reconnecter.';
      });
      return;
    }

    if (this.authService.isDemoMode()) {
      this.scheduleStateUpdate(() => {
        this.loading = false;
        this.error = 'Mode démo activé : le serveur backend n’est pas disponible, les alertes ne peuvent pas être chargées.';
      });
      return;
    }

    try {
      this.alerts = [];
      const alerts = await firstValueFrom(this.incidentService.getAlerts().pipe(timeout(8000)));
      const settled = await Promise.allSettled(
        alerts.map(async (alert) => {
          const detectionTime = alert.createdAt
            ? new Date(alert.createdAt).toLocaleString('fr-FR')
            : 'Inconnue';
          const voyage = alert.voyageId ? await this.loadVoyage(alert.voyageId) : undefined;
          return { ...alert, detectionTime, voyage };
        })
      );

      this.alerts = settled.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        }
        const alert = alerts[index];
        const detectionTime = alert.createdAt
          ? new Date(alert.createdAt).toLocaleString('fr-FR')
          : 'Inconnue';
        return { ...alert, detectionTime, voyage: undefined };
      });
    } catch (err: unknown) {
      console.error('Erreur chargement alertes', err);
      const anyErr = err as any;
      if (anyErr && anyErr.name === 'TimeoutError') {
        this.error = 'Temps d’attente dépassé. Impossible de charger les alertes. Vérifiez que le backend est en cours d’exécution.';
      } else if (anyErr && anyErr.status === 401) {
        this.error = 'Session expirée ou non autorisée. Veuillez vous reconnecter.';
      } else if (anyErr && anyErr.status === 0) {
        this.error = 'Impossible de contacter le backend. Vérifiez que le service est démarré et accessible.';
      } else if (anyErr && typeof anyErr.status === 'number') {
        try {
          const body = typeof anyErr.error === 'object' ? JSON.stringify(anyErr.error) : String(anyErr.error);
          this.error = `Erreur ${anyErr.status}: ${body}`;
        } catch {
          this.error = `Erreur ${anyErr.status}`;
        }
      } else {
        this.error = err instanceof Error ? err.message : String(err);
      }
    } finally {
      this.scheduleStateUpdate(() => {
        this.loading = false;
      });
    }
  }

  private async loadVoyage(voyageId: number): Promise<Voyage | undefined> {
    try {
      return await firstValueFrom(this.voyageService.getById(voyageId).pipe(timeout(5000)));
    } catch {
      return undefined;
    }
  }

  public onRefresh(): void {
    this.error = '';
    void this.loadAlerts();
  }
}
