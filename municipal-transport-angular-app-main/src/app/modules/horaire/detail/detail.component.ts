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
}