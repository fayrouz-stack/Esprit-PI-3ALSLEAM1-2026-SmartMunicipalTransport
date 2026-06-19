import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ContainerComponent, RowComponent, ColComponent, CardGroupComponent,
    CardComponent, CardBodyComponent, FormDirective, InputGroupComponent,
    InputGroupTextDirective, IconDirective, FormControlDirective,
    ButtonDirective, FormsModule
  ]
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router      = inject(Router);

  email    = '';
  password = '';
  loading  = false;
  errorMsg = '';

  login(): void {
    if (!this.email || !this.password || this.loading) return;
    this.loading  = true;
    this.errorMsg = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading  = false;
        this.errorMsg = err?.error?.error ?? 'Erreur de connexion. Vérifiez vos identifiants.';
      }
    });
  }
}

