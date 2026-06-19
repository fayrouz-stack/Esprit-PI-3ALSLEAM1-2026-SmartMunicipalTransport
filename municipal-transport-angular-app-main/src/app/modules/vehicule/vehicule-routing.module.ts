import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
import { FleetMapComponent } from './fleet-map/fleet-map.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'list', component: ListComponent, title: 'Liste des véhicules' },
  { path: 'fleet', component: FleetMapComponent, title: 'Carte Flotte Temps Réel' },
  { path: 'add', component: AddComponent, title: 'Ajouter un véhicule' },
  { path: 'edit/:id', component: EditComponent, title: 'Modifier un véhicule' },
  { path: 'detail/:id', component: DetailComponent, title: 'Détails du véhicule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiculeRoutingModule { }