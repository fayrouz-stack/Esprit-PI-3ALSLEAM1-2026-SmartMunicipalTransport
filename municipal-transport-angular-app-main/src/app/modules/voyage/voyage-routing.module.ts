<<<<<<< HEAD
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
import { PaymentComponent } from './payment/payment.component';
import { AlertsComponent } from './alerts/alerts.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'list', component: ListComponent, title: 'Liste des voyages' },
  { path: 'add', component: AddComponent, title: 'Ajouter un voyage' },
  { path: 'edit/:id', component: EditComponent, title: 'Modifier un voyage' },
  { path: 'detail/:id', component: DetailComponent, title: 'Détails du voyage' },
  { path: 'payment/:id', component: PaymentComponent, title: 'Paiement' },
  { path: 'alerts', component: AlertsComponent, title: 'Alertes de violence', canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
=======
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'list', component: ListComponent, title: 'Liste des voyages' },
  { path: 'add', component: AddComponent, title: 'Ajouter un voyage' },
  { path: 'edit/:id', component: EditComponent, title: 'Modifier un voyage' },
  { path: 'detail/:id', component: DetailComponent, title: 'Détails du voyage' },
  { path: 'payment/:id', component: PaymentComponent, title: 'Paiement' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
export class VoyageRoutingModule {}