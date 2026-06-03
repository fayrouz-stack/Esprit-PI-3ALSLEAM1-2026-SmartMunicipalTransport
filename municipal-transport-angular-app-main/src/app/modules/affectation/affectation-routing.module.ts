import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AffectationListComponent } from './list/list.component';
import { AffectationFormComponent } from './form/form.component';
import { AffectationPlanningComponent } from './planning/planning.component';
import { AffectationDetailComponent } from './detail/detail.component';

const routes: Routes = [
  { path: '', component: AffectationListComponent },
  { path: 'add', component: AffectationFormComponent },
  { path: 'edit/:id', component: AffectationFormComponent },
  { path: 'detail/:id', component: AffectationDetailComponent },
  { path: 'planning', component: AffectationPlanningComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffectationRoutingModule {}
