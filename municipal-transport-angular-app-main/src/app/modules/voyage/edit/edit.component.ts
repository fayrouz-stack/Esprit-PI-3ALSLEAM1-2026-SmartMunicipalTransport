import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VoyageService } from '../voyage.service';
import { LigneService } from '../../ligne/ligne.service';
import { HoraireService } from '../../horaire/horaire.service';
import { ChauffeurService } from '../../chauffeur/chauffeur.service';
import { VehiculeService } from '../../vehicule/vehicule.service';
import { Ligne, Horaire, Chauffeur, Vehicule } from '../models/voyage.model';

@Component({
  selector: 'app-voyage-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  standalone: false
})
export class EditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private voyageService = inject(VoyageService);
  private ligneService = inject(LigneService);
  private horaireService = inject(HoraireService);
  private chauffeurService = inject(ChauffeurService);
  private vehiculeService = inject(VehiculeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  voyageForm!: FormGroup;
  voyageId!: number;
  submitting = false;

  lignes: Ligne[] = [];
  horaires: Horaire[] = [];
  chauffeurs: Chauffeur[] = [];
  vehicules: Vehicule[] = [];

  ngOnInit(): void {
    this.voyageId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.voyageId) {
      this.router.navigate(['/voyages/list']);
      return;
    }
    this.initForm();
    this.loadLists();
    this.loadVoyage();
  }

  initForm(): void {
    this.voyageForm = this.fb.group({
      dateVoyage: ['', Validators.required],
      nombrePlacesDisponible: [1, [Validators.required, Validators.min(1)]],
      prix: [0, [Validators.required, Validators.min(0)]],
      ligneId: [0, Validators.required],
      horaireId: [0, Validators.required],
      vehiculeId: [0, Validators.required],
      chauffeurMatricule: ['', Validators.required]
    });
  }

  loadLists(): void {
    this.ligneService.getAll().subscribe(data => this.lignes = data);
    this.horaireService.getAll().subscribe(data => this.horaires = data);
    this.chauffeurService.getAll().subscribe(data => this.chauffeurs = data);
    this.vehiculeService.getAll().subscribe(data => this.vehicules = data);
  }

  loadVoyage(): void {
    this.voyageService.getById(this.voyageId).subscribe({
      next: (data: any) => {
        this.voyageForm.patchValue({
          dateVoyage: data.dateVoyage,
          nombrePlacesDisponible: data.nombrePlacesDisponible,
          prix: data.prix,
          ligneId: data.ligne?.id || 0,
          horaireId: data.horaire?.id || 0,
          vehiculeId: data.vehicule?.id || 0,
          chauffeurMatricule: data.chauffeur?.matricule || ''
        });
      },
      error: () => {
        this.router.navigate(['/voyages/list']);
      }
    });
  }

  onSubmit(): void {
    if (this.voyageForm.invalid) {
      Object.keys(this.voyageForm.controls).forEach(key => {
        this.voyageForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.voyageForm.value;
    const payload = {
      dateVoyage: formValue.dateVoyage,
      nombrePlacesDisponible: formValue.nombrePlacesDisponible,
      prix: formValue.prix,
      ligne: { id: formValue.ligneId },
      horaire: { id: formValue.horaireId },
      vehicule: { id: formValue.vehiculeId },
      chauffeur: { matricule: formValue.chauffeurMatricule }
    };

    this.submitting = true;
    this.voyageService.update(this.voyageId, payload).subscribe({
      next: () => {
        this.router.navigate(['/voyages/list']);
      },
      error: (err) => {
        console.error('Erreur modification', err);
        this.submitting = false;
      }
    });
  }

  get f() {
    return this.voyageForm.controls;
  }
}