<<<<<<< HEAD
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { StationService } from '../station.service';
import { LigneService } from '../../ligne/ligne.service';
import { Station } from '../station.model';
import { Ligne } from '../../ligne/ligne.model';

@Component({
  selector: 'app-station-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  stations: Station[] = [];
  filteredStations: Station[] = [];
  lignes: Ligne[] = [];
  searchTerm = '';
  filterVille = '';
  loading = false;

  constructor(
    private stationService: StationService,
    private ligneService: LigneService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStations();
    this.ligneService.getAll().subscribe(l => {
      this.lignes = l;
      this.cdr.markForCheck();
    });
  }

  get villes(): string[] {
    return [...new Set(this.stations.map(s => s.ville).filter(Boolean))].sort();
  }

  loadStations(): void {
    if (this.stations.length === 0) this.loading = true;
    this.stationService.getAll().subscribe({
      next: (data) => {
        try {
          this.stations = data ?? [];
          this.applySearch();
        } finally {
          this.loading = false;
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Erreur chargement stations', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applySearch(): void {
    const s = this.searchTerm.toLowerCase();
    this.filteredStations = this.stations.filter(st =>
      (!this.filterVille || st.ville === this.filterVille) &&
      (!s ||
        st.nom?.toLowerCase().includes(s) ||
        st.ville?.toLowerCase().includes(s) ||
        st.adresse?.toLowerCase().includes(s))
    );
  }

  lignesCount(stationId: number): number {
    return this.lignes.filter(l =>
      (l.stations ?? []).some(s => s.id === stationId)
    ).length;
  }

  deleteStation(id: number): void {
    if (confirm('Supprimer cette station ?')) {
      this.stationService.delete(id).subscribe({
        next: () => this.loadStations(),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }
=======
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { StationService } from '../station.service';
import { Station } from '../station.model';

@Component({
  selector: 'app-station-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  stations: Station[] = [];
  filteredStations: Station[] = [];
  searchTerm = '';
  loading = false;

  constructor(private stationService: StationService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadStations();
  }

  loadStations(): void {
    if (this.stations.length === 0) this.loading = true;
    this.stationService.getAll().subscribe({
      next: (data) => {
        this.stations = data;
        this.applySearch();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement stations', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applySearch(): void {
    const s = this.searchTerm.toLowerCase();
    this.filteredStations = s
      ? this.stations.filter(st =>
          st.nom?.toLowerCase().includes(s) ||
          st.ville?.toLowerCase().includes(s) ||
          st.adresse?.toLowerCase().includes(s))
      : [...this.stations];
  }

  deleteStation(id: number): void {
    if (confirm('Supprimer cette station ?')) {
      this.stationService.delete(id).subscribe({
        next: () => this.loadStations(),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}