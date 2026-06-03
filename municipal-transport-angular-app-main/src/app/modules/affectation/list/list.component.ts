import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AffectationService } from '../affectation.service';
import { Affectation } from '../affectation.model';

@Component({
  selector: 'app-affectation-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AffectationListComponent implements OnInit {

  private service = inject(AffectationService);
  private cdr = inject(ChangeDetectorRef);

  affectations: Affectation[] = [];
  filtered: Affectation[] = [];
  loading = false;
  filterStatut = '';
  searchTerm = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    if (this.affectations.length === 0) this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.affectations = data;
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement affectations', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilters(): void {
    const s = this.searchTerm.toLowerCase();
    this.filtered = this.affectations.filter(a =>
      (!this.filterStatut || a.statut === this.filterStatut) &&
      (!s || String(a.chauffeurId).includes(s) || String(a.vehiculeId).includes(s) || String(a.ligneId).includes(s))
    );
  }

  deleteAffectation(id: number): void {
    if (confirm('Supprimer cette affectation ?')) {
      this.service.delete(id).subscribe({
        next: () => this.load(),
        error: (err) => console.error(err)
      });
    }
  }

  statutBadgeColor(statut?: string): string {
    switch (statut) {
      case 'PLANIFIEE': return 'info';
      case 'EN_COURS':  return 'primary';
      case 'TERMINEE':  return 'success';
      case 'ANNULEE':   return 'danger';
      default:          return 'secondary';
    }
  }
}
