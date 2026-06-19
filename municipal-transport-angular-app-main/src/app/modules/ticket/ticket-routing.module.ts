import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TicketListComponent } from './list/list.component';
import { TicketAddComponent } from './add/add.component';
import { TicketEditComponent } from './edit/edit.component';
import { TicketDetailComponent } from './detail/detail.component';

const routes: Routes = [
  { path: '', component: TicketListComponent },
  { path: 'add', component: TicketAddComponent },
  { path: 'edit/:id', component: TicketEditComponent },
  { path: ':id', component: TicketDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule {}
