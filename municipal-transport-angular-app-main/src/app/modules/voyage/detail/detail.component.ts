import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoyageService } from '../voyage.service';
import { Voyage } from '../models/voyage.model';

@Component({
  selector: 'app-voyage-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: false
})
export class DetailComponent implements OnInit {
  private voyageService = inject(VoyageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  voyage: Voyage | null = null;
  loading = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadVoyage(id);
  }

  loadVoyage(id: number): void {
    this.loading = true;
    this.voyageService.getById(id).subscribe({
      next: (data) => {
        this.voyage = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/voyages/list']);
  }

  getPlacesColor(places: number): string {
    if (places > 10) return 'success';
    if (places > 0)  return 'warning';
    return 'danger';
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

  get revenuPotentiel(): number {
    if (!this.voyage) return 0;
    return this.voyage.prix * this.voyage.nombrePlacesDisponible;
  }
}