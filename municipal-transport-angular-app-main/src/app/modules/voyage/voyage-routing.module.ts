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
export class VoyageRoutingModule {}