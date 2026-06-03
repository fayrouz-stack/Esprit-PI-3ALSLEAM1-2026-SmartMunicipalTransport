import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChauffeurService } from '../chauffeur.service';
import { Chauffeur } from '../chauffeur.model';

@Component({
  selector: 'app-chauffeur-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ChauffeurDetailComponent implements OnInit {

  chauffeur: Chauffeur | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private service: ChauffeurService
  ) {}

  ngOnInit(): void {
    this.loadChauffeur();
  }

  loadChauffeur(): void {

    const idParam = this.route.snapshot.paramMap.get('id');

    console.log('Route ID:', idParam);

    if (!idParam) {
      this.error = 'ID not found in route';
      return;
    }

    const id = Number(idParam);

    this.loading = true;
    this.error = '';
    this.chauffeur = null;

    this.service.getById(id).subscribe({
      next: (data) => {
        console.log('API DATA:', data);

        this.chauffeur = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('API ERROR:', err);

        this.error = 'Error loading data';
        this.loading = false;
      }
    });
  }

  refresh(): void {
    console.log('Manual refresh clicked');
    this.loadChauffeur();
  }
}
