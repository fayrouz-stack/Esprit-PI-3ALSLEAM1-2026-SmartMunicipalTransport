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

  getPlacesClass(places: number): string {
    if (places > 10) return 'success';
    if (places > 0) return 'warning';
    return 'danger';
  }
}