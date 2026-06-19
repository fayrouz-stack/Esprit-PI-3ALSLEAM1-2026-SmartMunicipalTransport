import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ChauffeurService } from '../chauffeur.service';
import { Chauffeur } from '../chauffeur.model';

@Component({
  selector: 'app-chauffeur-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChauffeurListComponent implements OnInit {

  private chauffeurService = inject(ChauffeurService);
  private cdr = inject(ChangeDetectorRef);

  chauffeurs: Chauffeur[] = [];
  filteredChauffeurs: Chauffeur[] = [];

  loading = false;
<<<<<<< HEAD
  searchTerm  = '';
  filterPermis = '';

  currentPage   = 1;
  itemsPerPage  = 10;

  ngOnInit(): void { this.loadChauffeurs(); }

  loadChauffeurs(): void {
    if (this.chauffeurs.length === 0) this.loading = true;
    this.chauffeurService.getAll().subscribe({
      next: (response) => {
        try {
          this.chauffeurs = response ?? [];
          this.applyFilters();
        } finally {
          this.loading = false;
          this.cdr.markForCheck();
        }
=======
  searchTerm = '';

  currentPage = 1;
  itemsPerPage = 10;

  totalItems = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.loadChauffeurs();
  }

  loadChauffeurs(): void {
    // Spinner uniquement au premier chargement
    if (this.chauffeurs.length === 0) this.loading = true;

    this.chauffeurService.getAll().subscribe({
      next: (response) => {
        this.chauffeurs = response;
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
      },
      error: (err) => {
        console.error('Erreur lors du chargement', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilters(): void {
<<<<<<< HEAD
    const s = this.searchTerm.toLowerCase();
    this.filteredChauffeurs = this.chauffeurs.filter(c => {
      const matchSearch = !s
        || c.nom?.toLowerCase().includes(s)
        || c.prenom?.toLowerCase().includes(s)
        || c.cin?.toLowerCase().includes(s)
        || c.matricule?.toLowerCase().includes(s)
        || c.telephone?.includes(s);
      const matchPermis = !this.filterPermis || c.permis === this.filterPermis;
      return matchSearch && matchPermis;
    });
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchTerm  = '';
    this.filterPermis = '';
    this.applyFilters();
  }

  // ── KPI ──────────────────────────────────────────────────────────────────
  get stats() {
    const today = new Date().toDateString();
    return {
      total:          this.chauffeurs.length,
      enService:      this.chauffeurs.filter(c =>
                        c.lastShiftEnd && new Date(c.lastShiftEnd).toDateString() === today
                      ).length,
      sansConges:     this.chauffeurs.filter(c => (c.holidayRemaining ?? 0) === 0).length,
      totalConges:    this.chauffeurs.reduce((s, c) => s + (c.holidayRemaining ?? 0), 0),
    };
  }

  get permisTypes(): string[] {
    return [...new Set(this.chauffeurs.map(c => c.permis).filter(Boolean))].sort();
  }

  congesColor(n: number | undefined): string {
    const v = n ?? 0;
    if (v > 10) return 'success';
    if (v > 0)  return 'warning';
    return 'danger';
=======
    const search = this.searchTerm.toLowerCase();

    this.filteredChauffeurs = this.chauffeurs.filter(c =>
      !this.searchTerm ||
      c.nom?.toLowerCase().includes(search) ||
      c.prenom?.toLowerCase().includes(search) ||
      c.cin?.toLowerCase().includes(search)
    );

    this.totalItems = this.filteredChauffeurs.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    if (this.totalPages === 0) {
      this.totalPages = 1;
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.applyFilters();
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
  }

  deleteChauffeur(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?')) {
      this.chauffeurService.delete(id).subscribe({
<<<<<<< HEAD
        next: () => this.loadChauffeurs(),
        error: (err) => console.error('Erreur suppression', err)
=======
        next: () => {
          this.loadChauffeurs();
        },
        error: (err) => {
          console.error('Erreur suppression', err);
        }
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
      });
    }
  }

<<<<<<< HEAD
  get totalItems(): number { return this.filteredChauffeurs.length; }
  get totalPages(): number { return Math.ceil(this.totalItems / this.itemsPerPage) || 1; }

=======
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
  get paginatedChauffeurs(): Chauffeur[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredChauffeurs.slice(start, start + this.itemsPerPage);
  }

<<<<<<< HEAD
  previousPage(): void { if (this.currentPage > 1) this.currentPage--; }
  nextPage(): void     { if (this.currentPage < this.totalPages) this.currentPage++; }
=======
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}
