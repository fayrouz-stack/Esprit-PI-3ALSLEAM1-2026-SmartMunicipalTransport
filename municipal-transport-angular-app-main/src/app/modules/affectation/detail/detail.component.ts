import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AffectationService } from '../affectation.service';
import { Affectation } from '../affectation.model';

@Component({
  selector: 'app-affectation-detail',
  standalone: false,
  templateUrl: './detail.component.html'
})
export class AffectationDetailComponent implements OnInit {
  private service = inject(AffectationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  affectation: Affectation | null = null;
  loading = false;

  readonly statutColors: Record<string, string> = {
    PLANIFIEE: 'info',
    EN_COURS: 'primary',
    TERMINEE: 'success',
    ANNULEE: 'danger'
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.router.navigate(['/affectations']); return; }
    this.loading = true;
    this.service.getById(id).subscribe({
      next: (data) => { this.affectation = data; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/affectations']); }
    });
  }

  back(): void {
    this.router.navigate(['/affectations']);
  }

  statutColor(statut?: string): string {
    return this.statutColors[statut ?? ''] ?? 'secondary';
  }
}
