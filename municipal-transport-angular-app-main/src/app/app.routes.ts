import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/routes').then(m => m.routes)
      },
      // ========== MES MODULES SMARTBUS ==========
      {
        path: 'vehicules',
        loadChildren: () => import('./modules/vehicule/vehicule.module').then((m) => m.VehiculeModule)
      },
      {
        path: 'chauffeurs',
        loadChildren: () => import('./modules/chauffeur/chauffeur.module').then((m) => m.ChauffeurModule)
      },
      {
        path: 'lignes',
        loadChildren: () => import('./modules/ligne/ligne.module').then((m) => m.LigneModule)
      },
      {
        path: 'stations',
        loadChildren: () => import('./modules/station/station.module').then((m) => m.StationModule)
      },
      {
        path: 'horaires',
        loadChildren: () => import('./modules/horaire/horaire.module').then((m) => m.HoraireModule)
      },
      {
        path: 'voyages',
        loadChildren: () => import('./modules/voyage/voyage.module').then((m) => m.VoyageModule)
      },
      {
        path: 'incidents',
        loadChildren: () => import('./modules/incident/incident.module').then((m) => m.IncidentModule)
      },
      {
        path: 'tickets',
        loadChildren: () => import('./modules/ticket/ticket.module').then((m) => m.TicketModule)
      },
      {
        path: 'affectations',
        loadChildren: () => import('./modules/affectation/affectation.module').then((m) => m.AffectationModule)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
