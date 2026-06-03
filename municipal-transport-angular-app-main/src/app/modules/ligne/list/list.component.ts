import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LigneService } from '../ligne.service';
import { Ligne } from '../ligne.model';

@Component({
  selector: 'app-ligne-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  lignes: Ligne[] = [];
  loading = false;

  constructor(private ligneService: LigneService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadLignes();
  }

  loadLignes(): void {
    if (this.lignes.length === 0) this.loading = true;
    this.ligneService.getAll().subscribe({
      next: (data) => {
        this.lignes = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement lignes', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
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