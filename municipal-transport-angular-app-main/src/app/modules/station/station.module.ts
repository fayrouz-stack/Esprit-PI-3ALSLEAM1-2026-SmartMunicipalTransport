import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  BadgeModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  ModalModule,
  TableModule,
  ToastModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

import { StationRoutingModule } from './station-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    StationRoutingModule,
    BadgeModule,
    ButtonModule,
    CardModule,
    FormModule,
    GridModule,
    ModalModule,
    TableModule,
    ToastModule,
    IconModule
  ]
})
export class StationModule {}