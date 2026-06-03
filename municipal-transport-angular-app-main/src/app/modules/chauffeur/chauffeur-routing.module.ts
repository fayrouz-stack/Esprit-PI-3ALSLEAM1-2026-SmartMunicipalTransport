import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChauffeurListComponent } from './list/list.component';
import { ChauffeurAddComponent } from './add/add.component';
import { ChauffeurEditComponent } from './edit/edit.component';
import { ChauffeurDetailComponent } from './detail/detail.component';

const routes: Routes = [
  { path: '', component: ChauffeurListComponent },
  { path: 'add', component: ChauffeurAddComponent },
  { path: 'edit/:id', component: ChauffeurEditComponent },
  { path: ':id', component: ChauffeurDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChauffeurRoutingModule {}
