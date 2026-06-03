import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HoraireService } from '../horaire.service';
import { Horaire } from '../horaire.model';

@Component({
  selector: 'app-horaire-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  horaires: Horaire[] = [];
  loading = false;

  constructor(private horaireService: HoraireService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadHoraires();
  }

  loadHoraires(): void {
    if (this.horaires.length === 0) this.loading = true;
    this.horaireService.getAll().subscribe({
      next: (data) => {
        this.horaires = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement horaires', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
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