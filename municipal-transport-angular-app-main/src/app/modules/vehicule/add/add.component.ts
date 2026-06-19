<<<<<<< HEAD
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehiculeService } from '../vehicule.service';

@Component({
  selector: 'app-vehicule-add',
  templateUrl: './add.component.html',
  standalone: false,
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  private fb = inject(FormBuilder);
  private vehiculeService = inject(VehiculeService);
  private router = inject(Router);

  vehiculeForm!: FormGroup;
  submitting = false;

  // Listes pour les selects
  typesVehicule = ['Voiture', 'Bus', 'Minibus', 'Camion', 'Utilitaire'];
  
  etats = [
    'disponible',
    'en service',
    'en panne',
    'bon état',
    'neuf',
    'usé',
    'en réparation'
  ];
  
  carburants = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'];

  ngOnInit(): void {
    console.log('AddComponent chargé !');
    this.initForm();
  }

  initForm(): void {
    this.vehiculeForm = this.fb.group({
      marque: ['', [Validators.required, Validators.minLength(2)]],
      modele: ['', [Validators.required, Validators.minLength(1)]],
      typeVehicule: ['', Validators.required],           // ← corrigé
      etat: ['disponible', Validators.required],
      vehiculeDispo: [true],
      matriculeFourni: ['', [Validators.required, Validators.minLength(3)]],
      localisation: [''],
      kilometrage: [0, [Validators.required, Validators.min(0)]],
      dateFinAssurance: [null],                          // ← corrigé
      dateProchainCt: [null],                            // ← corrigé
      datePremiereMiseCirculation: [null],               // ← corrigé
      carburant: ['', Validators.required],
      dateValiditeExploitation: [null],                  // ← corrigé
      latitude: [null],
      longitude: [null]
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
    this.vehiculeService.create(this.vehiculeForm.value).subscribe({
      next: () => {
        this.router.navigate(['/vehicules']);
      },
      error: (err) => {
        console.error('Erreur lors de la création', err);
        this.submitting = false;
      }
    });
  }

  resetForm(): void {
    this.vehiculeForm.reset({
      marque: '',
      modele: '',
      typeVehicule: '',
      etat: 'disponible',
      vehiculeDispo: true,
      matriculeFourni: '',
      localisation: '',
      kilometrage: 0,
      dateFinAssurance: null,
      dateProchainCt: null,
      datePremiereMiseCirculation: null,
      carburant: '',
      dateValiditeExploitation: null
    });
  }

  // Getters pour faciliter l'accès aux champs dans le template
  get f() {
    return this.vehiculeForm.controls;
  }
=======
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehiculeService } from '../vehicule.service';

@Component({
  selector: 'app-vehicule-add',
  templateUrl: './add.component.html',
  standalone: false,
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  private fb = inject(FormBuilder);
  private vehiculeService = inject(VehiculeService);
  private router = inject(Router);

  vehiculeForm!: FormGroup;
  submitting = false;

  // Listes pour les selects
  typesVehicule = ['Voiture', 'Bus', 'Minibus', 'Camion', 'Utilitaire'];
  
  etats = [
    'disponible',
    'en service',
    'en panne',
    'bon état',
    'neuf',
    'usé',
    'en réparation'
  ];
  
  carburants = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'];

  ngOnInit(): void {
    console.log('AddComponent chargé !');
    this.initForm();
  }

  initForm(): void {
    this.vehiculeForm = this.fb.group({
      marque: ['', [Validators.required, Validators.minLength(2)]],
      modele: ['', [Validators.required, Validators.minLength(1)]],
      typeVehicule: ['', Validators.required],           // ← corrigé
      etat: ['disponible', Validators.required],
      vehiculeDispo: [true],
      matriculeFourni: ['', [Validators.required, Validators.minLength(3)]],
      localisation: [''],
      kilometrage: [0, [Validators.required, Validators.min(0)]],
      dateFinAssurance: [null],                          // ← corrigé
      dateProchainCt: [null],                            // ← corrigé
      datePremiereMiseCirculation: [null],               // ← corrigé
      carburant: ['', Validators.required],
      dateValiditeExploitation: [null],                  // ← corrigé
      latitude: [null],
      longitude: [null]
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
    this.vehiculeService.create(this.vehiculeForm.value).subscribe({
      next: () => {
        this.router.navigate(['/vehicules']);
      },
      error: (err) => {
        console.error('Erreur lors de la création', err);
        this.submitting = false;
      }
    });
  }

  resetForm(): void {
    this.vehiculeForm.reset({
      marque: '',
      modele: '',
      typeVehicule: '',
      etat: 'disponible',
      vehiculeDispo: true,
      matriculeFourni: '',
      localisation: '',
      kilometrage: 0,
      dateFinAssurance: null,
      dateProchainCt: null,
      datePremiereMiseCirculation: null,
      carburant: '',
      dateValiditeExploitation: null
    });
  }

  // Getters pour faciliter l'accès aux champs dans le template
  get f() {
    return this.vehiculeForm.controls;
  }
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}