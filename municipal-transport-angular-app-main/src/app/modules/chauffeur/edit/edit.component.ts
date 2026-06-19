import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChauffeurService } from '../chauffeur.service';
import { Chauffeur } from '../chauffeur.model';

@Component({
  selector: 'app-chauffeur-edit',
  standalone: false,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class ChauffeurEditComponent implements OnInit {

  chauffeur: Chauffeur = this.initForm();
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private service: ChauffeurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) return;

    this.service.getById(id).subscribe({
      next: (data) => {
        this.chauffeur = {
          ...this.initForm(),
          ...data
        };
      },
      error: err => console.error(err)
    });
  }

  private initForm(): Chauffeur {
    return {
      cin: '',
      nom: '',
      prenom: '',
      permis: '',
      telephone: '',
      matricule: '',
      psw: '',
      email: '',
      holidayRemaining: 0,
      dateStart: '',
      lastShiftStart: '',
      lastShiftEnd: '',
      countWorkDays: 0
    };
  }

  update(form: any): void {
    if (form.invalid || this.loading) return;

    this.loading = true;

    // IMPORTANT: DO NOT touch auto fields
    const payload: Chauffeur = {
      ...this.chauffeur
    };

    this.service.update(this.chauffeur.id!, payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/chauffeurs']);
      },
      error: err => {
        this.loading = false;
        console.error(err);
      }
    });
  }
}
