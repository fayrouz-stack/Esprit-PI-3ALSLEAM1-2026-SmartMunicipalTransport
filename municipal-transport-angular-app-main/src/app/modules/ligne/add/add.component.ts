import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LigneService } from '../ligne.service';

@Component({
  selector: 'app-ligne-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  standalone: false
})
export class AddComponent implements OnInit {
  form!: FormGroup;
  submitting = false;

  constructor(private fb: FormBuilder, private service: LigneService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      numero: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.service.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/lignes/list']),
      error: (err) => {
        console.error(err);
        this.submitting = false;
      }
    });
  }
}