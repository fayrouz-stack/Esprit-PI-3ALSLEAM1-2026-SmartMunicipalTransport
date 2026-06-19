import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculeService } from '../vehicule.service';

@Component({
  selector: 'app-vehicule-edit',
  templateUrl: './edit.component.html',
  standalone: false,
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private vehiculeService = inject(VehiculeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  vehiculeForm!: FormGroup;
  submitting = false;
  vehiculeId!: number;

  // Listes pour les selects
  typesVehicule = ['Voiture', 'Bus', 'Minibus', 'Camion', 'Utilitaire'];
  etats = ['disponible', 'en service', 'en panne', 'bon état', 'neuf', 'usé', 'en réparation'];
  carburants = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'];

  ngOnInit(): void {
    this.vehiculeId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.vehiculeId) {
      this.router.navigate(['/vehicules']);
    }
    this.initForm();
    this.loadVehicule();
  }

  initForm(): void {
    this.vehiculeForm = this.fb.group({
      marque: ['', [Validators.required, Validators.minLength(2)]],
      modele: ['', [Validators.required, Validators.minLength(1)]],
      typeVehicule: ['', Validators.required],
      etat: ['bon état', Validators.required],
      vehiculeDispo: [true],
      matriculeFourni: ['', [Validators.required, Validators.minLength(3)]],
      localisation: [''],
      kilometrage: [0, [Validators.required, Validators.min(0)]],
      dateFinAssurance: [null],
      dateProchainCt: [null],
      datePremiereMiseCirculation: [null],
      carburant: ['', Validators.required],
      dateValiditeExploitation: [null],
      latitude: [null],
      longitude: [null]
    });
  }

  loadVehicule(): void {
    this.vehiculeService.getById(this.vehiculeId).subscribe({
      next: (vehicule) => {
        this.vehiculeForm.patchValue(vehicule);
      },
      error: (err) => {
        console.error('Erreur chargement:', err);
        this.router.navigate(['/vehicules']);
      }
    });
  }

  onSubmit(): void {
    if (this.vehiculeForm.invalid) {
      Object.keys(this.vehiculeForm.controls).forEach(key => {
        this.vehiculeForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.vehiculeService.update(this.vehiculeId, this.vehiculeForm.value).subscribe({
      next: () => {
        this.router.navigate(['/vehicules']);
      },
      error: (err) => {
        console.error('Erreur lors de la modification', err);
        this.submitting = false;
      }
    });
  }

  resetForm(): void {
    this.loadVehicule(); // Recharge les données originales
  }

  get f() {
    return this.vehiculeForm.controls;
  }
}