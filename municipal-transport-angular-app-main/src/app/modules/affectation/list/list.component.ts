import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AffectationService } from '../affectation.service';
import { Affectation } from '../affectation.model';
import { ChauffeurService } from '../../chauffeur/chauffeur.service';
import { VehiculeService } from '../../vehicule/vehicule.service';
import { LigneService } from '../../ligne/ligne.service';
import { Chauffeur } from '../../chauffeur/chauffeur.model';
import { Vehicule } from '../../vehicule/vehicule.model';
import { Ligne } from '../../ligne/ligne.model';

@Component({
  selector: 'app-affectation-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AffectationListComponent implements OnInit {

  private service        = inject(AffectationService);
  private chauffeurSvc   = inject(ChauffeurService);
  private vehiculeSvc    = inject(VehiculeService);
  private ligneSvc       = inject(LigneService);
  private cdr            = inject(ChangeDetectorRef);

  affectations: Affectation[] = [];
  filtered: Affectation[] = [];
  chauffeurs: Chauffeur[] = [];
  vehicules: Vehicule[] = [];
  lignes: Ligne[] = [];

  loading = false;
  filterStatut = '';
  filterLigne = '';
  searchTerm = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    forkJoin({
      affectations: this.service.getAll(),
      chauffeurs:   this.chauffeurSvc.getAll(),
      vehicules:    this.vehiculeSvc.getAll(),
      lignes:       this.ligneSvc.getAll()
    }).subscribe({
      next: (res) => {
        try {
          this.affectations = res.affectations ?? [];
          this.chauffeurs   = res.chauffeurs ?? [];
          this.vehicules    = res.vehicules ?? [];
          this.lignes       = res.lignes ?? [];
          this.applyFilters();
        } finally {
          this.loading = false;
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Erreur chargement affectations', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilters(): void {
    const s = this.searchTerm.toLowerCase();
    this.filtered = this.affectations.filter(a => {
      const c = this.getChauffeur(a.chauffeurId);
      const v = this.getVehicule(a.vehiculeId);
      const l = this.getLigne(a.ligneId);
      const matchSearch = !s
        || `${c?.nom} ${c?.prenom}`.toLowerCase().includes(s)
        || (v?.matriculeFourni ?? '').toLowerCase().includes(s)
        || (l?.destination ?? '').toLowerCase().includes(s)
        || String(a.chauffeurId).includes(s)
        || String(a.vehiculeId).includes(s);
      const matchStatut = !this.filterStatut || a.statut === this.filterStatut;
      const matchLigne  = !this.filterLigne  || String(a.ligneId) === this.filterLigne;
      return matchSearch && matchStatut && matchLigne;
    });
  }

  getChauffeur(id: number): Chauffeur | undefined {
    return this.chauffeurs.find(c => c.id === id);
  }

  getVehicule(id: number): Vehicule | undefined {
    return this.vehicules.find(v => v.id === id);
  }

  getLigne(id: number): Ligne | undefined {
    return this.lignes.find(l => l.id === id);
  }

  duree(debut: string, fin: string): string {
    if (!debut || !fin) return '—';
    const diff = new Date(fin).getTime() - new Date(debut).getTime();
    if (diff <= 0) return '—';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return h > 0 ? `${h}h${m.toString().padStart(2,'0')}` : `${m}min`;
  }

  deleteAffectation(id: number): void {
    if (confirm('Supprimer cette affectation ?')) {
      this.service.delete(id).subscribe({
        next: () => this.load(),
        error: (err) => console.error(err)
      });
    }
  }

  statutBadgeColor(statut?: string): string {
    switch (statut) {
      case 'PLANIFIEE': return 'info';
      case 'EN_COURS':  return 'primary';
      case 'TERMINEE':  return 'success';
      case 'ANNULEE':   return 'danger';
      default:          return 'secondary';
    }
  }

  get stats() {
    return {
      total:      this.affectations.length,
      planifiees: this.affectations.filter(a => a.statut === 'PLANIFIEE').length,
      enCours:    this.affectations.filter(a => a.statut === 'EN_COURS').length,
      terminees:  this.affectations.filter(a => a.statut === 'TERMINEE').length,
      annulees:   this.affectations.filter(a => a.statut === 'ANNULEE').length,
    };
  }
}
