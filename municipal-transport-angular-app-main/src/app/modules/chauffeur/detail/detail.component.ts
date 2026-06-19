import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChauffeurService } from '../chauffeur.service';
import { Chauffeur } from '../chauffeur.model';
import { VoyageService } from '../../voyage/voyage.service';
import { AffectationService } from '../../affectation/affectation.service';
import { Affectation } from '../../affectation/affectation.model';

@Component({
  selector: 'app-chauffeur-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ChauffeurDetailComponent implements OnInit {

  chauffeur: Chauffeur | null = null;
  loading = false;
  error = '';

  activeTab: 'info' | 'voyages' | 'affectations' = 'info';

  voyages: any[] = [];
  affectations: Affectation[] = [];

  readonly statutColors: Record<string, string> = {
    'PLANIFIEE': 'info', 'EN_COURS': 'primary', 'TERMINEE': 'success', 'ANNULEE': 'danger'
  };

  constructor(
    private route: ActivatedRoute,
    private service: ChauffeurService,
    private voyageService: VoyageService,
    private affectationService: AffectationService
  ) {}

  ngOnInit(): void { this.loadChauffeur(); }

  loadChauffeur(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) { this.error = 'ID introuvable'; return; }
    const id = Number(idParam);
    this.loading = true;
    this.error = '';
    this.service.getById(id).subscribe({
      next: (data) => {
        this.chauffeur = data;
        this.loading = false;
        this.loadVoyages(data.matricule);
        this.loadAffectations(id);
      },
      error: () => { this.error = 'Impossible de charger le chauffeur'; this.loading = false; }
    });
  }

  loadVoyages(matricule: string): void {
    this.voyageService.getAll().subscribe({
      next: (data) => {
        this.voyages = (data ?? [])
          .filter(v => v.chauffeur?.matricule === matricule)
          .sort((a, b) => new Date(b.dateVoyage).getTime() - new Date(a.dateVoyage).getTime())
          .slice(0, 10);
      },
      error: () => {}
    });
  }

  loadAffectations(chauffeurId: number): void {
    this.affectationService.getAll().subscribe({
      next: (data) => {
        this.affectations = (data ?? [])
          .filter(a => Number(a.chauffeurId) === chauffeurId)
          .sort((a, b) => new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime())
          .slice(0, 10);
      },
      error: () => {}
    });
  }

  anciennete(dateStart: string | undefined): string {
    if (!dateStart) return '—';
    const start = new Date(dateStart);
    const now   = new Date();
    const ans   = now.getFullYear() - start.getFullYear();
    const mois  = now.getMonth() - start.getMonth() + (ans * 12);
    const a     = Math.floor(mois / 12);
    const m     = mois % 12;
    if (a === 0) return `${m} mois`;
    return m === 0 ? `${a} an${a > 1 ? 's' : ''}` : `${a} an${a > 1 ? 's' : ''} ${m} mois`;
  }

  get congesProgress(): number {
    return Math.min(100, ((this.chauffeur?.holidayRemaining ?? 0) / 30) * 100);
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

  refresh(): void { this.loadChauffeur(); }
}
