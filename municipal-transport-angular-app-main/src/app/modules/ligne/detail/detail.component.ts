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