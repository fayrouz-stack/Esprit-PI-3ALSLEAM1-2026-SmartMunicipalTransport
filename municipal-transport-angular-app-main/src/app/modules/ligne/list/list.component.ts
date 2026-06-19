import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LigneService } from '../ligne.service';
import { HoraireService } from '../../horaire/horaire.service';
import { Ligne } from '../ligne.model';
import { Horaire } from '../../horaire/horaire.model';

@Component({
  selector: 'app-ligne-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  lignes: Ligne[] = [];
  filtered: Ligne[] = [];
  horaires: Horaire[] = [];
  searchTerm = '';
  loading = false;

  constructor(
    private ligneService: LigneService,
    private horaireService: HoraireService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLignes();
    this.horaireService.getAll().subscribe(h => {
      this.horaires = h;
      this.cdr.markForCheck();
    });
  }

  loadLignes(): void {
    if (this.lignes.length === 0) this.loading = true;
    this.ligneService.getAll().subscribe({
      next: (data) => {
        try {
          this.lignes = data ?? [];
          this.applySearch();
        } finally {
          this.loading = false;
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Erreur chargement lignes', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applySearch(): void {
    const s = this.searchTerm.toLowerCase();
    this.filtered = s
      ? this.lignes.filter(l =>
          l.numero?.toLowerCase().includes(s) ||
          l.destination?.toLowerCase().includes(s))
      : [...this.lignes];
  }

  horairesCount(ligneId: number): number {
    return this.horaires.filter(h => h.ligne?.id === ligneId).length;
  }

  deleteLigne(id: number): void {
    if (confirm('Supprimer cette ligne ?')) {
      this.ligneService.delete(id).subscribe({
        next: () => this.loadLignes(),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }
}