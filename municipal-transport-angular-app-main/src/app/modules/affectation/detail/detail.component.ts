<<<<<<< HEAD
import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AffectationService } from '../affectation.service';
import { Affectation } from '../affectation.model';
import { ChauffeurService } from '../../chauffeur/chauffeur.service';
import { VehiculeService } from '../../vehicule/vehicule.service';
import { LigneService } from '../../ligne/ligne.service';
import { Chauffeur } from '../../chauffeur/chauffeur.model';
import { Vehicule } from '../../vehicule/vehicule.model';
import { Ligne } from '../../ligne/ligne.model';
=======
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AffectationService } from '../affectation.service';
import { Affectation } from '../affectation.model';
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced

@Component({
  selector: 'app-affectation-detail',
  standalone: false,
<<<<<<< HEAD
  templateUrl: './detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AffectationDetailComponent implements OnInit {
  private service      = inject(AffectationService);
  private chauffeurSvc = inject(ChauffeurService);
  private vehiculeSvc  = inject(VehiculeService);
  private ligneSvc     = inject(LigneService);
  private route        = inject(ActivatedRoute);
  private router       = inject(Router);
  private cdr          = inject(ChangeDetectorRef);

  affectation: Affectation | null = null;
  chauffeur: Chauffeur | null = null;
  vehicule: Vehicule | null = null;
  ligne: Ligne | null = null;
=======
  templateUrl: './detail.component.html'
})
export class AffectationDetailComponent implements OnInit {
  private service = inject(AffectationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  affectation: Affectation | null = null;
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
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
<<<<<<< HEAD
      next: (a) => {
        this.affectation = a;
        forkJoin({
          chauffeur: this.chauffeurSvc.getById(a.chauffeurId),
          vehicule:  this.vehiculeSvc.getById(a.vehiculeId),
          ligne:     this.ligneSvc.getById(a.ligneId)
        }).subscribe({
          next: (res) => {
            try {
              this.chauffeur = res.chauffeur;
              this.vehicule  = res.vehicule;
              this.ligne     = res.ligne;
            } finally {
              this.loading = false;
              this.cdr.markForCheck();
            }
          },
          error: () => { this.loading = false; this.cdr.markForCheck(); }
        });
      },
=======
      next: (data) => { this.affectation = data; this.loading = false; },
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
      error: () => { this.loading = false; this.router.navigate(['/affectations']); }
    });
  }

<<<<<<< HEAD
  duree(): string {
    if (!this.affectation?.dateDebut || !this.affectation?.dateFin) return '—';
    const diff = new Date(this.affectation.dateFin).getTime() - new Date(this.affectation.dateDebut).getTime();
    if (diff <= 0) return '—';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}j ${h % 24}h${m.toString().padStart(2,'0')}`;
    return h > 0 ? `${h}h${m.toString().padStart(2,'0')}` : `${m}min`;
  }

  statutColor(statut?: string): string {
    return this.statutColors[statut ?? ''] ?? 'secondary';
  }

  get statutLabel(): string {
    const labels: Record<string, string> = {
      PLANIFIEE: '🗓️ Planifiée',
      EN_COURS: '⚡ En cours',
      TERMINEE: '✅ Terminée',
      ANNULEE: '❌ Annulée'
    };
    return labels[this.affectation?.statut ?? ''] ?? (this.affectation?.statut ?? 'Non défini');
  }

  back(): void {
    this.router.navigate(['/affectations']);
  }
=======
  back(): void {
    this.router.navigate(['/affectations']);
  }

  statutColor(statut?: string): string {
    return this.statutColors[statut ?? ''] ?? 'secondary';
  }
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}
