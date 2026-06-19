<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HoraireService, EstimationRetard } from '../horaire.service';
import { Horaire } from '../horaire.model';
import { VehiculeService } from '../../vehicule/vehicule.service';
import { Vehicule } from '../../vehicule/vehicule.model';

@Component({
  selector: 'app-horaire-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: false
})
export class DetailComponent implements OnInit {
  horaire?: Horaire;

  // Estimation
  vehicules: Vehicule[] = [];
  selectedVehiculeId: number | null = null;
  estimation: EstimationRetard | null = null;
  estimating = false;
  estimationError: string | null = null;

  constructor(
    private service: HoraireService,
    private vehiculeService: VehiculeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.service.getById(id).subscribe(data => this.horaire = data);
    this.vehiculeService.getAll().subscribe(v => this.vehicules = v ?? []);
  }

  back(): void {
    this.router.navigate(['/horaires/list']);
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

  estimer(): void {
    if (!this.horaire?.id) return;
    this.estimating = true;
    this.estimation = null;
    this.estimationError = null;
    this.service.estimerRetard(this.horaire.id, this.selectedVehiculeId).subscribe({
      next: (res) => {
        this.estimation = res;
        if (this.horaire) this.horaire.retard_estime = res.retard_total;
        this.estimating = false;
      },
      error: () => {
        this.estimationError = 'Erreur lors de l\'estimation. Veuillez réessayer.';
        this.estimating = false;
      }
    });
  }
=======
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HoraireService } from '../horaire.service';
import { Horaire } from '../horaire.model';

@Component({
  selector: 'app-horaire-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: false
})
export class DetailComponent implements OnInit {
  horaire?: Horaire;

  constructor(
    private service: HoraireService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.service.getById(id).subscribe(data => this.horaire = data);
  }

  back(): void {
    this.router.navigate(['/horaires/list']);
  }
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}