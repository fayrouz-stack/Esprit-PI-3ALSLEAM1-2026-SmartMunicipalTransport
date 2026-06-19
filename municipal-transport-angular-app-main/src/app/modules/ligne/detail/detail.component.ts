<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LigneService } from '../ligne.service';
import { HoraireService } from '../../horaire/horaire.service';
import { StationService } from '../../station/station.service';
import { Ligne } from '../ligne.model';
import { Station } from '../../station/station.model';
import { Horaire } from '../../horaire/horaire.model';

@Component({
  selector: 'app-ligne-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: false
})
export class DetailComponent implements OnInit {
  ligne?: Ligne;
  horaires: Horaire[] = [];
  allStations: Station[] = [];
  selectedStationId: number | null = null;
  activeTab: 'info' | 'stations' | 'horaires' = 'info';
  addingStation = false;

  constructor(
    private service: LigneService,
    private horaireService: HoraireService,
    private stationService: StationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.service.getById(id).subscribe(data => this.ligne = data);
    this.horaireService.getByLigne(id).subscribe(data => this.horaires = data);
    this.stationService.getAll().subscribe(s => this.allStations = s);
  }

  get availableStations(): Station[] {
    const ids = new Set((this.ligne?.stations ?? []).map(s => s.id));
    return this.allStations.filter(s => !ids.has(s.id));
  }

  addStation(): void {
    if (!this.ligne?.id || !this.selectedStationId) return;
    this.addingStation = true;
    this.service.addStation(this.ligne.id, this.selectedStationId).subscribe({
      next: updated => {
        this.ligne = updated;
        this.selectedStationId = null;
        this.addingStation = false;
      },
      error: () => this.addingStation = false
    });
  }

  removeStation(stationId: number): void {
    if (!this.ligne?.id) return;
    this.service.removeStation(this.ligne.id, stationId).subscribe(updated => this.ligne = updated);
  }

  formatTime(t: string): string {
    return t ? t.substring(0, 5) : '--:--';
  }

  back(): void {
    this.router.navigate(['/lignes/list']);
  }
}
=======
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LigneService } from '../ligne.service';
import { Ligne } from '../ligne.model';

@Component({
  selector: 'app-ligne-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: false
})
export class DetailComponent implements OnInit {
  ligne?: Ligne;

  constructor(private service: LigneService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.service.getById(id).subscribe(data => this.ligne = data);
  }

  back(): void {
    this.router.navigate(['/lignes/list']);
  }
}
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
