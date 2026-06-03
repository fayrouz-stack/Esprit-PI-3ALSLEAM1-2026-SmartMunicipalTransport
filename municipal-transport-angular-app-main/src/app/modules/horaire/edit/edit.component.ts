import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HoraireService } from '../horaire.service';

@Component({
  selector: 'app-horaire-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  standalone: false
})
export class EditComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private service: HoraireService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.form = this.fb.group({
      date_voyage: ['', Validators.required],
      horaire_depart: ['', Validators.required],
      horaire_arrive: ['', Validators.required],
      retard_estime: [0]
    });
    
    this.service.getById(this.id).subscribe(data => {
      this.form.patchValue(data);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    
    this.submitting = true;
    this.service.update(this.id, this.form.value).subscribe({
      next: () => this.router.navigate(['/horaires/list']),
      error: (err) => {
        console.error('Erreur modification horaire', err);
        this.submitting = false;
      }
    });
  }
}