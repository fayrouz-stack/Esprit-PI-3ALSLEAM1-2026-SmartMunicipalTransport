import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StationService } from '../station.service';
import { LigneService } from '../../ligne/ligne.service';
import { Station } from '../station.model';
import { Ligne } from '../../ligne/ligne.model';

@Component({
  selector: 'app-station-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: false
})
export class DetailComponent implements OnInit {
  station?: Station;
  lignesPassant: Ligne[] = [];

  constructor(
    private service: StationService,
    private ligneService: LigneService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.service.getById(id).subscribe(data => this.station = data);
    this.ligneService.getAll().subscribe(lignes => {
      this.lignesPassant = lignes.filter(l =>
        (l.stations ?? []).some(s => s.id === id)
      );
    });
  }

  back(): void {
    this.router.navigate(['/stations/list']);
  }
}