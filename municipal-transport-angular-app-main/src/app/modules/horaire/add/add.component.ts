import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HoraireService } from '../horaire.service';
import { LigneService } from '../../ligne/ligne.service';
import { StationService } from '../../station/station.service';
import { Ligne } from '../../ligne/ligne.model';
import { Station } from '../../station/station.model';

@Component({
  selector: 'app-horaire-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  standalone: false
})
export class AddComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  lignes: Ligne[] = [];
  stations: Station[] = [];

  constructor(
    private fb: FormBuilder,
    private service: HoraireService,
    private ligneService: LigneService,
    private stationService: StationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      date_voyage:      ['', Validators.required],
      horaire_depart:   ['', Validators.required],
      horaire_arrive:   ['', Validators.required],
      retard_estime:    [0],
      ligne:            [null],
      stationDepart:    [null],
      stationArrivee:   [null]
    });
    this.ligneService.getAll().subscribe(l => this.lignes = l);
    this.stationService.getAll().subscribe(s => this.stations = s);
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
    this.service.create(payload).subscribe({
      next: () => this.router.navigate(['/horaires/list']),
      error: (err) => { console.error('Erreur création horaire', err); this.submitting = false; }
    });
  }
}