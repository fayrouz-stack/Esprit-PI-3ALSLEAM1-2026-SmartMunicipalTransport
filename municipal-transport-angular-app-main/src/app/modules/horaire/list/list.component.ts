import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HoraireService } from '../horaire.service';
import { LigneService } from '../../ligne/ligne.service';
import { Horaire } from '../horaire.model';
import { Ligne } from '../../ligne/ligne.model';

@Component({
  selector: 'app-horaire-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  horaires: Horaire[] = [];
  filtered: Horaire[] = [];
  lignes: Ligne[] = [];
  searchTerm = '';
  filterLigne = '';
  filterRetard = '';
  loading = false;

  constructor(
    private horaireService: HoraireService,
    private ligneService: LigneService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadHoraires();
    this.ligneService.getAll().subscribe(l => {
      this.lignes = l;
      this.cdr.markForCheck();
    });
  }

  loadHoraires(): void {
    if (this.horaires.length === 0) this.loading = true;
    this.horaireService.getAll().subscribe({
      next: (data) => {
        try {
          this.horaires = data ?? [];
          this.applyFilters();
        } finally {
          this.loading = false;
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Erreur chargement horaires', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilters(): void {
    const s = this.searchTerm.toLowerCase();
    this.filtered = this.horaires.filter(h => {
      const matchLigne  = !this.filterLigne  || String(h.ligne?.id) === this.filterLigne;
      const matchRetard = !this.filterRetard
        || (this.filterRetard === 'ponctuel' && (h.retard_estime ?? 0) === 0)
        || (this.filterRetard === 'retard'   && (h.retard_estime ?? 0) > 0);
      const matchSearch = !s
        || h.ligne?.numero?.toLowerCase().includes(s)
        || h.stationDepart?.nom?.toLowerCase().includes(s)
        || h.stationArrivee?.nom?.toLowerCase().includes(s)
        || h.date_voyage?.includes(s);
      return matchLigne && matchRetard && matchSearch;
    });
  }

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

  deleteHoraire(id: number): void {
    if (confirm('Supprimer cet horaire ?')) {
      this.horaireService.delete(id).subscribe({
        next: () => this.loadHoraires(),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  formatTime(time: string): string {
    return time ? time.substring(0, 5) : '-';
  }
}
