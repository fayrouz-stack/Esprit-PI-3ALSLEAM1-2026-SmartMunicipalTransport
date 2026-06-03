import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  CardModule,
  ButtonModule,
  FormModule,
  GridModule,
  TableModule,
  BadgeModule,
  PaginationModule,
  TooltipModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

import { TicketRoutingModule } from './ticket-routing.module';
import { TicketListComponent } from './list/list.component';
import { TicketAddComponent } from './add/add.component';
import { TicketEditComponent } from './edit/edit.component';
import { TicketDetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [
    TicketListComponent,
    TicketAddComponent,
    TicketEditComponent,
    TicketDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TicketRoutingModule,
    CardModule,
    ButtonModule,
    FormModule,
    GridModule,
    TableModule,
    BadgeModule,
    PaginationModule,
    TooltipModule,
    IconModule
  ]
})
export class TicketModule {}
