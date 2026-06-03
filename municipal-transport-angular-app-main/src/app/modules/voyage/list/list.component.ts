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
}