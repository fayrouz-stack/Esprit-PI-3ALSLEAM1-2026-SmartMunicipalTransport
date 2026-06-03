import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StationService } from '../station.service';

@Component({
  selector: 'app-station-edit',
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
    private service: StationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.form = this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required]
    });
    this.service.getById(this.id).subscribe(data => this.form.patchValue(data));
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.service.update(this.id, this.form.value).subscribe({
      next: () => this.router.navigate(['/stations/list']),
      error: (err) => {
        console.error(err);
        this.submitting = false;
      }
    });
  }
}