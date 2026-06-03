import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StationService } from '../station.service';
import { Station } from '../station.model';

@Component({
  selector: 'app-station-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: false
})
export class DetailComponent implements OnInit {
  station?: Station;

  constructor(private service: StationService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.service.getById(id).subscribe(data => this.station = data);
  }

  back(): void {
    this.router.navigate(['/stations/list']);
  }
}