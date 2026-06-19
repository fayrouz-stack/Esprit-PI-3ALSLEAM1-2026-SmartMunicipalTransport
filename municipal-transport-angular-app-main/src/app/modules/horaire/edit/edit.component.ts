<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HoraireService } from '../horaire.service';
import { LigneService } from '../../ligne/ligne.service';
import { StationService } from '../../station/station.service';
import { Ligne } from '../../ligne/ligne.model';
import { Station } from '../../station/station.model';

@Component({
  selector: 'app-horaire-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  standalone: false
})
export class EditComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  submitting = false;
  lignes: Ligne[] = [];
  stations: Station[] = [];

  constructor(
    private fb: FormBuilder,
    private service: HoraireService,
    private ligneService: LigneService,
    private stationService: StationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.form = this.fb.group({
      date_voyage:    ['', Validators.required],
      horaire_depart: ['', Validators.required],
      horaire_arrive: ['', Validators.required],
      retard_estime:  [0],
      ligne:          [null],
      stationDepart:  [null],
      stationArrivee: [null]
    });
    this.ligneService.getAll().subscribe(l => this.lignes = l);
    this.stationService.getAll().subscribe(s => this.stations = s);
    this.service.getById(this.id).subscribe(data => {
      this.form.patchValue({
        date_voyage:    data.date_voyage,
        horaire_depart: data.horaire_depart,
        horaire_arrive: data.horaire_arrive,
        retard_estime:  data.retard_estime ?? 0,
        ligne:          data.ligne?.id ?? null,
        stationDepart:  data.stationDepart?.id ?? null,
        stationArrivee: data.stationArrivee?.id ?? null
      });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    const val = this.form.value;
    const payload: any = {
      date_voyage:    val.date_voyage,
      horaire_depart: val.horaire_depart,
      horaire_arrive: val.horaire_arrive,
      retard_estime:  val.retard_estime ?? 0,
      ligne:          val.ligne    ? { id: +val.ligne }    : null,
      stationDepart:  val.stationDepart  ? { id: +val.stationDepart }  : null,
      stationArrivee: val.stationArrivee ? { id: +val.stationArrivee } : null
    };
    this.service.update(this.id, payload).subscribe({
      next: () => this.router.navigate(['/horaires/list']),
      error: (err) => { console.error('Erreur modification horaire', err); this.submitting = false; }
    });
  }
}
=======
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HoraireService } from '../horaire.service';

@Component({
  selector: 'app-horaire-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  standalone: false
})
export class EditComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private service: HoraireService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.form = this.fb.group({
      date_voyage: ['', Validators.required],
      horaire_depart: ['', Validators.required],
      horaire_arrive: ['', Validators.required],
      retard_estime: [0]
    });
    
    this.service.getById(this.id).subscribe(data => {
      this.form.patchValue(data);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    
    this.submitting = true;
    this.service.update(this.id, this.form.value).subscribe({
      next: () => this.router.navigate(['/horaires/list']),
      error: (err) => {
        console.error('Erreur modification horaire', err);
        this.submitting = false;
      }
    });
  }
}
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
