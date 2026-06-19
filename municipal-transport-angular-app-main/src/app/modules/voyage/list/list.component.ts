<<<<<<< HEAD
import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { VoyageService } from '../voyage.service';
import { Voyage } from '../models/voyage.model';

@Component({
  selector: 'app-voyage-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  private voyageService = inject(VoyageService);
  private router        = inject(Router);
  private cdr           = inject(ChangeDetectorRef);

  voyages:  Voyage[] = [];
  filtered: Voyage[] = [];
  loading = false;

  search           = '';
  filterStatut     = '';   // '' | 'disponible' | 'complet'
  filterLigne      = '';

  ngOnInit(): void { this.loadVoyages(); }

  loadVoyages(): void {
    if (this.voyages.length === 0) this.loading = true;
    this.voyageService.getAll().subscribe({
      next: (data) => {
        try {
          this.voyages = data ?? [];
          this.applyFilters();
        } finally {
          this.loading = false;
          this.cdr.markForCheck();
        }
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  applyFilters(): void {
    const s = this.search.toLowerCase();
    this.filtered = this.voyages.filter(v => {
      const matchSearch = !s
        || v.ligne?.destination?.toLowerCase().includes(s)
        || v.ligne?.numero?.toLowerCase().includes(s)
        || v.dateVoyage?.toLowerCase().includes(s)
        || v.chauffeur?.nom?.toLowerCase().includes(s)
        || v.chauffeur?.prenom?.toLowerCase().includes(s)
        || v.vehicule?.matriculeFourni?.toLowerCase().includes(s);

      const matchStatut = !this.filterStatut
        || (this.filterStatut === 'disponible' && v.nombrePlacesDisponible > 0)
        || (this.filterStatut === 'complet'    && v.nombrePlacesDisponible === 0);

      const matchLigne = !this.filterLigne || String(v.ligne?.id) === this.filterLigne;

      return matchSearch && matchStatut && matchLigne;
    });
  }

  resetFilters(): void {
    this.search = '';
    this.filterStatut = '';
    this.filterLigne = '';
    this.applyFilters();
  }

  // ── KPI ──────────────────────────────────────────────────────────────────
  get stats() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      total:          this.voyages.length,
      disponibles:    this.voyages.filter(v => v.nombrePlacesDisponible > 0).length,
      complets:       this.voyages.filter(v => v.nombrePlacesDisponible === 0).length,
      aujourd_hui:    this.voyages.filter(v => v.dateVoyage?.startsWith(today)).length,
      revenuTotal:    this.voyages.reduce((s, v) => s + v.prix * v.nombrePlacesDisponible, 0),
    };
  }

  get lignes(): { id: number; numero: string; destination: string }[] {
    const seen = new Set<number>();
    return this.voyages
      .filter(v => v.ligne?.id && !seen.has(v.ligne.id) && seen.add(v.ligne.id))
      .map(v => ({ id: v.ligne.id!, numero: v.ligne.numero, destination: v.ligne.destination }));
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  duree(depart: string, arrive: string): string {
    if (!depart || !arrive) return '-';
    const [dh, dm] = depart.split(':').map(Number);
    const [ah, am] = arrive.split(':').map(Number);
    let diff = (ah * 60 + am) - (dh * 60 + dm);
    if (diff < 0) diff += 24 * 60;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m} min`;
  }

  revenu(v: Voyage): number { return v.prix * v.nombrePlacesDisponible; }

  getPlacesColor(places: number): string {
    if (places > 10) return 'success';
    if (places > 0)  return 'warning';
    return 'danger';
  }

  edit(id: number | undefined): void {
    if (id) this.router.navigate(['/voyages/edit', id]);
  }

  deleteVoyage(id: number | undefined): void {
    if (!id || !confirm('Supprimer ce voyage ?')) return;
    this.voyageService.delete(id).subscribe(() => this.loadVoyages());
  }

  goToPayment(id: number | undefined): void {
    if (id) this.router.navigate(['/voyages/payment', id]);
  }
=======
import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { VoyageService } from '../voyage.service';
import { Voyage } from '../models/voyage.model';

@Component({
  selector: 'app-voyage-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  private voyageService = inject(VoyageService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  voyages: Voyage[] = [];
  filtered: Voyage[] = [];
  loading = false;
  search = '';

  ngOnInit(): void {
    this.loadVoyages();
  }

  loadVoyages(): void {
    if (this.voyages.length === 0) this.loading = true;
    this.voyageService.getAll().subscribe({
      next: (data) => {
        this.voyages = data;
        this.filtered = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter(): void {
    const s = this.search.toLowerCase();
    this.filtered = this.voyages.filter(v =>
      v.ligne?.destination?.toLowerCase().includes(s) ||
      v.dateVoyage?.toLowerCase().includes(s) ||
      v.chauffeur?.nom?.toLowerCase().includes(s) ||
      v.chauffeur?.prenom?.toLowerCase().includes(s)
    );
  }

  edit(id: number | undefined): void {
    if (id) this.router.navigate(['/voyages/edit', id]);
  }

  deleteVoyage(id: number | undefined): void {
    if (!id || !confirm('Supprimer ce voyage ?')) return;
    this.voyageService.delete(id).subscribe(() => this.loadVoyages());
  }

  goToPayment(id: number | undefined): void {
    if (id) this.router.navigate(['/voyages/payment', id]);
  }

  getPlacesClass(places: number): string {
    if (places > 10) return 'success';
    if (places > 0) return 'warning';
    return 'danger';
  }
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}