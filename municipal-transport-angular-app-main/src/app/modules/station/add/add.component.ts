<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StationService } from '../station.service';

@Component({
  selector: 'app-station-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  standalone: false
})
export class AddComponent implements OnInit {
  form!: FormGroup;
  submitting = false;

  constructor(private fb: FormBuilder, private service: StationService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.service.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/stations/list']),
      error: (err) => {
        console.error(err);
        this.submitting = false;
      }
    });
  }
=======
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StationService } from '../station.service';

@Component({
  selector: 'app-station-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  standalone: false
})
export class AddComponent implements OnInit {
  form!: FormGroup;
  submitting = false;

  constructor(private fb: FormBuilder, private service: StationService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.service.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/stations/list']),
      error: (err) => {
        console.error(err);
        this.submitting = false;
      }
    });
  }
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}