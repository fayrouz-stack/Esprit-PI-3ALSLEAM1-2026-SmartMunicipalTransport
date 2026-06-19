import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { VehiculeService } from '../vehicule.service';
import { Vehicule } from '../vehicule.model';

@Component({
  selector: 'app-vehicule-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  vehicules: Vehicule[] = [];
  filteredVehicules: Vehicule[] = [];
  loading = false;
  searchTerm = '';
  etatFilter = '';
  typeFilter = '';
  carburantFilter = '';

  currentPage = 1;
  itemsPerPage = 10;

  etats = ['disponible', 'en service', 'en panne', 'bon état', 'neuf', 'usé', 'en réparation'];

  constructor(private vehiculeService: VehiculeService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadVehicules();
  }

  loadVehicules(): void {
    if (this.vehicules.length === 0) this.loading = true;
    this.vehiculeService.getAll().subscribe({
      next: (response: Vehicule[]) => {
        try {
          this.vehicules = response ?? [];
          this.applyFilters();
        } finally {
          this.loading = false;
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Erreur', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilters(): void {
    const s = this.searchTerm.toLowerCase();
    this.filteredVehicules = this.vehicules.filter(v => {
      const matchSearch = !s
        || v.matriculeFourni?.toLowerCase().includes(s)
        || v.marque?.toLowerCase().includes(s)
        || v.modele?.toLowerCase().includes(s)
        || v.localisation?.toLowerCase().includes(s);
      const matchEtat      = !this.etatFilter      || v.etat          === this.etatFilter;
      const matchType      = !this.typeFilter      || v.typeVehicule  === this.typeFilter;
      const matchCarburant = !this.carburantFilter || v.carburant     === this.carburantFilter;
      return matchSearch && matchEtat && matchType && matchCarburant;
    });
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.etatFilter = '';
    this.typeFilter = '';
    this.carburantFilter = '';
    this.applyFilters();
  }

  // KPI stats
  get stats() {
    return {
      total:        this.vehicules.length,
      disponibles:  this.vehicules.filter(v => v.vehiculeDispo).length,
      enPanne:      this.vehicules.filter(v => v.etat?.toLowerCase() === 'en panne').length,
      enReparation: this.vehicules.filter(v => v.etat?.toLowerCase() === 'en réparation').length,
      enService:    this.vehicules.filter(v => v.etat?.toLowerCase() === 'en service').length,
    };
  }

  // Unique values for dropdowns
  get types(): string[] {
    return [...new Set(this.vehicules.map(v => v.typeVehicule).filter(Boolean))].sort();
  }
  get carburants(): string[] {
    return [...new Set(this.vehicules.map(v => v.carburant).filter(Boolean))].sort();
  }

  deleteVehicule(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      this.vehiculeService.delete(id).subscribe({
        next: () => this.loadVehicules(),
        error: (err) => console.error(err)
      });
    }
  }

  getEtatClass(etat: string): string {
    const classes: Record<string, string> = {
      'disponible': 'bg-success', 'en service': 'bg-primary', 'en panne': 'bg-danger',
      'bon état': 'bg-info', 'neuf': 'bg-success', 'usé': 'bg-secondary', 'en réparation': 'bg-warning'
    };
    return classes[etat] || 'bg-secondary';
  }

  kmClass(km: number | undefined): string {
    if (!km) return '';
    if (km > 200_000) return 'text-danger fw-bold';
    if (km > 100_000) return 'text-warning fw-bold';
    return 'text-success';
  }

  assuranceClass(date: Date | string | null): string {
    if (!date) return 'bg-secondary';
    const d = new Date(date);
    const diffDays = Math.floor((d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0)  return 'bg-danger';
    if (diffDays <= 30) return 'bg-warning text-dark';
    return 'bg-success';
  }

  assuranceLabel(date: Date | string | null): string {
    if (!date) return '-';
    const d = new Date(date);
    const diffDays = Math.floor((d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const formatted = d.toLocaleDateString('fr-FR');
    if (diffDays < 0)   return `⚠️ Expirée (${formatted})`;
    if (diffDays <= 30) return `⏳ ${diffDays}j (${formatted})`;
    return formatted;
  }

  get totalItems(): number { return this.filteredVehicules.length; }
  get totalPages(): number { return Math.ceil(this.totalItems / this.itemsPerPage) || 1; }

  get paginatedVehicules(): Vehicule[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredVehicules.slice(start, start + this.itemsPerPage);
  }

  previousPage(): void { if (this.currentPage > 1) this.currentPage--; }
  nextPage(): void     { if (this.currentPage < this.totalPages) this.currentPage++; }
}