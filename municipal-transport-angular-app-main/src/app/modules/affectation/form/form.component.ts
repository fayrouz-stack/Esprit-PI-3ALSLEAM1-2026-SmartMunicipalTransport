import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AffectationService } from '../affectation.service';
<<<<<<< HEAD
import { Affectation, AutoAssignRequest } from '../affectation.model';
=======
import { Affectation } from '../affectation.model';
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
import { ChauffeurService } from '../../chauffeur/chauffeur.service';
import { VehiculeService } from '../../vehicule/vehicule.service';
import { LigneService } from '../../ligne/ligne.service';

@Component({
  selector: 'app-affectation-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class AffectationFormComponent implements OnInit {

  private service = inject(AffectationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chauffeurService = inject(ChauffeurService);
  private vehiculeService = inject(VehiculeService);
  private ligneService = inject(LigneService);

  affectation: Affectation = this.initForm();
  loading = false;
  errorMsg = '';
  isEdit = false;

<<<<<<< HEAD
  // Mode création : 'manuel' | 'auto'
  autoMode      = false;
  autoAssigning = false;
  autoError     = '';

=======
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
  chauffeurs: any[] = [];
  vehicules: any[] = [];
  lignes: any[] = [];

  ngOnInit(): void {
    // Chargement des listes pour les selects
    this.chauffeurService.getAll().subscribe(d => this.chauffeurs = d);
    this.vehiculeService.getAll().subscribe(d => this.vehicules = d);
    this.ligneService.getAll().subscribe(d => this.lignes = d);

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEdit = true;
      this.service.getById(id).subscribe({
        next: (data) => {
          this.affectation = {
            ...this.initForm(),
            ...data,
            dateDebut: this.toDatetimeLocal(data.dateDebut),
            dateFin: this.toDatetimeLocal(data.dateFin)
          };
        },
        error: (err) => console.error(err)
      });
    }
  }

  private initForm(): Affectation {
    return {
      chauffeurId: 0,
      vehiculeId: 0,
      ligneId: 0,
      dateDebut: '',
      dateFin: '',
      statut: 'PLANIFIEE',
      remarque: ''
    };
  }

  // Conversion ISO datetime → format datetime-local (YYYY-MM-DDTHH:mm)
  private toDatetimeLocal(iso?: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  save(form: any): void {
    if (form.invalid || this.loading) return;
    this.loading = true;
    this.errorMsg = '';

    // Conversion datetime-local → ISO datetime pour le backend
    const payload: Affectation = {
      ...this.affectation,
      dateDebut: new Date(this.affectation.dateDebut).toISOString(),
      dateFin: new Date(this.affectation.dateFin).toISOString()
    };

    const obs = this.isEdit
      ? this.service.update(this.affectation.id!, payload)
      : this.service.create(payload);

    obs.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/affectations']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.error || 'Erreur lors de l\'enregistrement';
        console.error(err);
      }
    });
  }
<<<<<<< HEAD

  /**
   * Envoie une requête POST /api/affectations/auto avec la ligne et les dates.
   * Le backend trouve le premier chauffeur + véhicule disponibles,
   * crée l'affectation et retourne l'objet complet.
   * On redirige ensuite vers le détail.
   */
  autoAssign(): void {
    this.autoError = '';
    this.errorMsg  = '';

    if (!this.affectation.ligneId) {
      this.autoError = 'Sélectionnez d\'abord une ligne.';
      return;
    }
    if (!this.affectation.dateDebut || !this.affectation.dateFin) {
      this.autoError = 'Renseignez les dates de début et de fin avant de lancer l\'auto-assignation.';
      return;
    }

    this.autoAssigning = true;
    const req: AutoAssignRequest = {
      ligneId:   this.affectation.ligneId,
      dateDebut: new Date(this.affectation.dateDebut).toISOString(),
      dateFin:   new Date(this.affectation.dateFin).toISOString()
    };

    this.service.autoAssign(req).subscribe({
      next: (result) => {
        this.autoAssigning = false;
        this.router.navigate(['/affectations', result.id]);
      },
      error: (err) => {
        this.autoAssigning = false;
        this.autoError = err?.error?.error || 'Aucune ressource disponible sur cette plage.';
      }
    });
  }
=======
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}
