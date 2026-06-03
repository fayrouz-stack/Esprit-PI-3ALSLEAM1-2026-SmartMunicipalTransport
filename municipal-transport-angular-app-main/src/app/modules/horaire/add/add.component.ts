import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HoraireService } from '../horaire.service';

@Component({
  selector: 'app-horaire-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  standalone: false
})
export class AddComponent implements OnInit {
  form!: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private service: HoraireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      date_voyage: ['', Validators.required],
      horaire_depart: ['', Validators.required],
      horaire_arrive: ['', Validators.required],
      retard_estime: [0]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    
    this.submitting = true;
    this.service.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/horaires/list']),
      error: (err) => {
        console.error('Erreur création horaire', err);
        this.submitting = false;
      }
    });
  }
}