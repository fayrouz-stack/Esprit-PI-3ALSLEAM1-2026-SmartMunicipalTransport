import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChauffeurService } from '../chauffeur.service';
import { Chauffeur } from '../chauffeur.model';

@Component({
  selector: 'app-chauffeur-add',
  standalone: false,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class ChauffeurAddComponent implements OnInit {

  chauffeur: Chauffeur = this.initForm();

  loading = false;

  constructor(
    private service: ChauffeurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chauffeur.dateStart = this.today();
  }

  private initForm(): Chauffeur {
    return {
      cin: '',
      nom: '',
      prenom: '',
      permis: 'B',
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

  private today(): string {
    return new Date().toISOString().split('T')[0];
  }

  save(form: any): void {
    if (form.invalid || this.loading) return;

    this.loading = true;

    // psw et matricule sont générés côté backend (@PrePersist)
    const payload: Chauffeur = {
      ...this.chauffeur,
      psw: '',
      matricule: '',
      holidayRemaining: 0,
      countWorkDays: 0,
      lastShiftStart: null as any,
      lastShiftEnd: null as any
    };

    this.service.create(payload).subscribe({
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
