<<<<<<< HEAD
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { VehiculeService } from '../vehicule.service';
import { Vehicule } from '../vehicule.model';
import { AffectationService } from '../../affectation/affectation.service';
import { Affectation } from '../../affectation/affectation.model';
import { environment } from '../../../environnement/environment';

@Component({
  selector: 'app-vehicule-detail',
  templateUrl: './detail.component.html',
  standalone: false,
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  private vehiculeService    = inject(VehiculeService);
  private affectationService = inject(AffectationService);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);
  private http    = inject(HttpClient);

  vehicule: Vehicule | null = null;
  loading = true;
  errorMsg: string | null = null;

  // Onglets
  activeTab: 'info' | 'iot' | 'affectations' = 'info';

  // Affectations
  affectations: Affectation[] = [];
  readonly statutColors: Record<string, string> = {
    'PLANIFIEE': 'info', 'EN_COURS': 'primary', 'TERMINEE': 'success', 'ANNULEE': 'danger'
  };

  // Télémétrie IoT
  telemetrie: any = null;
  private telemetrieTimer: any = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadVehicule(id);
      this.loadAffectations(id);
    }
  }

  loadVehicule(id: number): void {
    this.loading = true;
    this.vehiculeService.getById(id).subscribe({
      next: (data) => {
        this.vehicule = data;
        this.loading = false;
        this.startTelemetrieRefresh(id);
      },
      error: (err) => {
        this.errorMsg = `Impossible de charger le véhicule (${err.status || 'réseau'})`;
        this.loading = false;
      }
    });
  }

  loadAffectations(vehiculeId: number): void {
    this.affectationService.getAll().subscribe({
      next: (data) => {
        this.affectations = (data ?? [])
          .filter(a => Number(a.vehiculeId) === vehiculeId)
          .sort((a, b) => new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime())
          .slice(0, 10);
      },
      error: () => {}
    });
  }

  // ── Score de santé du véhicule (0–100) ────────────────────────────────────
  get healthScore(): number {
    if (!this.vehicule) return 0;
    let score = 100;
    const v = this.vehicule;
    const now = new Date();

    // État
    const etat = v.etat?.toLowerCase() ?? '';
    if (etat === 'en panne')      score -= 40;
    else if (etat === 'en réparation') score -= 25;
    else if (etat === 'usé')      score -= 15;
    else if (etat === 'neuf')     score += 5;

    // Kilométrage
    const km = v.kilometrage ?? 0;
    if (km > 300_000)      score -= 30;
    else if (km > 200_000) score -= 20;
    else if (km > 100_000) score -= 10;

    // Assurance
    if (v.dateFinAssurance) {
      const diff = Math.floor((new Date(v.dateFinAssurance).getTime() - now.getTime()) / 86400000);
      if (diff < 0)   score -= 20;
      else if (diff <= 30) score -= 10;
    }

    // CT
    if (v.dateProchainCt) {
      const diff = Math.floor((new Date(v.dateProchainCt).getTime() - now.getTime()) / 86400000);
      if (diff < 0)   score -= 15;
      else if (diff <= 30) score -= 7;
    }

    // Validité exploitation
    if (v.dateValiditeExploitation) {
      const diff = Math.floor((new Date(v.dateValiditeExploitation).getTime() - now.getTime()) / 86400000);
      if (diff < 0)   score -= 15;
      else if (diff <= 30) score -= 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  get healthColor(): string {
    const s = this.healthScore;
    if (s >= 75) return '#2eb85c';
    if (s >= 50) return '#f9b115';
    if (s >= 25) return '#e55353';
    return '#dc3545';
  }

  get healthLabel(): string {
    const s = this.healthScore;
    if (s >= 75) return '✅ Bon état général';
    if (s >= 50) return '⚠️ Attention requise';
    if (s >= 25) return '🔴 État critique';
    return '💀 Hors service';
  }

  // ── Télémétrie ────────────────────────────────────────────────────────────
  startTelemetrieRefresh(vehiculeId: number): void {
    let errorCount = 0;
    const fetch = () => {
      this.http.get(`${environment.apiUrl}/telemetrie/${vehiculeId}/latest`)
        .subscribe({
          next: (d) => { this.telemetrie = d; errorCount = 0; },
          error: () => {
            errorCount++;
            if (errorCount >= 3 && this.telemetrieTimer) {
              clearInterval(this.telemetrieTimer);
              this.telemetrieTimer = null;
            }
          }
        });
    };
    fetch();
    this.telemetrieTimer = setInterval(fetch, 10000);
  }

  ngOnDestroy(): void {
    if (this.telemetrieTimer) clearInterval(this.telemetrieTimer);
  }

  getGazClass(): string {
    if (!this.telemetrie) return 'secondary';
    return this.telemetrie.niveauGaz >= 1500 ? 'danger'
         : this.telemetrie.niveauGaz >= 800  ? 'warning' : 'success';
  }

  getTempClass(): string {
    if (!this.telemetrie) return 'secondary';
    const t = this.telemetrie.temperature;
    return t > 35 ? 'danger' : t > 28 ? 'warning' : 'success';
  }

  getEtatBadge(etat: string): string {
    if (!etat) return 'secondary';
    const e = etat.toLowerCase();
    if (e === 'disponible' || e === 'bon état' || e === 'neuf') return 'success';
    if (e === 'en service') return 'primary';
    if (e === 'en panne' || e === 'hors service') return 'danger';
    if (e === 'en réparation' || e === 'usé') return 'warning';
    return 'secondary';
  }

  getEtatClass(etat: string): string {
    const classes: Record<string, string> = {
      'disponible': 'bg-success', 'en service': 'bg-primary', 'en panne': 'bg-danger',
      'bon état': 'bg-info', 'neuf': 'bg-success', 'usé': 'bg-secondary', 'en réparation': 'bg-warning'
    };
    return classes[etat] || 'bg-secondary';
  }

  goBack(): void {
    this.router.navigate(['/vehicules']);
  }

  dateClass(date: Date | string | null): string {
    if (!date) return '';
    const diffDays = Math.floor((new Date(date).getTime() - new Date().getTime()) / 86400000);
    if (diffDays < 0)   return 'text-danger fw-bold';
    if (diffDays <= 30) return 'text-warning fw-bold';
    return 'text-success';
  }

  dateLabel(date: Date | string | null): string {
    if (!date) return '-';
    const d = new Date(date);
    const diffDays = Math.floor((d.getTime() - new Date().getTime()) / 86400000);
    const formatted = d.toLocaleDateString('fr-FR');
    if (diffDays < 0)   return `⚠️ Expirée — ${formatted}`;
    if (diffDays <= 30) return `⏳ ${diffDays}j — ${formatted}`;
    return formatted;
  }

  formatDate(date: Date | null | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
=======
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { VehiculeService } from '../vehicule.service';
import { Vehicule } from '../vehicule.model';
import { environment } from '../../../environnement/environment';

@Component({
  selector: 'app-vehicule-detail',
  templateUrl: './detail.component.html',
  standalone: false,
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  private vehiculeService = inject(VehiculeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  vehicule: Vehicule | null = null;
  loading = true;
  errorMsg: string | null = null;

  telemetrie: any = null;
  private telemetrieTimer: any = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadVehicule(id);
    }
  }

  loadVehicule(id: number): void {
    this.loading = true;
    this.vehiculeService.getById(id).subscribe({
      next: (data) => {
        this.vehicule = data;
        this.loading = false;
        this.startTelemetrieRefresh(id);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du véhicule', err);
        this.errorMsg = `Impossible de charger le véhicule (${err.status || 'réseau'})`;
        this.loading = false;
      }
    });
  }

  startTelemetrieRefresh(vehiculeId: number): void {
    let errorCount = 0;
    const fetch = () => {
      this.http.get(`${environment.apiUrl}/telemetrie/${vehiculeId}/latest`)
        .subscribe({
          next: (d) => { this.telemetrie = d; errorCount = 0; },
          error: () => {
            errorCount++;
            if (errorCount >= 3 && this.telemetrieTimer) {
              clearInterval(this.telemetrieTimer);
              this.telemetrieTimer = null;
            }
          }
        });
    };
    fetch();
    this.telemetrieTimer = setInterval(fetch, 10000);
  }

  ngOnDestroy(): void {
    if (this.telemetrieTimer) clearInterval(this.telemetrieTimer);
  }

  getGazClass(): string {
    if (!this.telemetrie) return 'secondary';
    return this.telemetrie.niveauGaz >= 1500 ? 'danger'
         : this.telemetrie.niveauGaz >= 800  ? 'warning' : 'success';
  }

  getTempClass(): string {
    if (!this.telemetrie) return 'secondary';
    const t = this.telemetrie.temperature;
    return t > 35 ? 'danger' : t > 28 ? 'warning' : 'success';
  }

  getEtatBadge(etat: string): string {
    if (!etat) return 'secondary';
    const e = etat.toLowerCase();
    if (e === 'disponible' || e === 'bon état' || e === 'neuf') return 'success';
    if (e === 'en service') return 'primary';
    if (e === 'en panne' || e === 'hors service') return 'danger';
    if (e === 'en réparation' || e === 'usé') return 'warning';
    return 'secondary';
  }

  goBack(): void {
    this.router.navigate(['/vehicules']);
  }

  dateClass(date: Date | string | null): string {
    if (!date) return '';
    const d = new Date(date);
    const diffDays = Math.floor((d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'text-danger fw-bold';
    if (diffDays <= 30) return 'text-warning fw-bold';
    return 'text-success';
  }

  dateLabel(date: Date | string | null): string {
    if (!date) return '-';
    const d = new Date(date);
    const diffDays = Math.floor((d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const formatted = d.toLocaleDateString('fr-FR');
    if (diffDays < 0) return `⚠️ Expirée — ${formatted}`;
    if (diffDays <= 30) return `⏳ ${diffDays}j — ${formatted}`;
    return formatted;
  }

  getEtatClass(etat: string): string {
    const classes: Record<string, string> = {
      'disponible': 'bg-success',
      'en service': 'bg-primary',
      'en panne': 'bg-danger',
      'bon état': 'bg-info',
      'neuf': 'bg-success',
      'usé': 'bg-secondary',
      'en réparation': 'bg-warning'
    };
    return classes[etat] || 'bg-secondary';
  }

  formatDate(date: Date | null | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
