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
  AvatarModule,
  PaginationModule,
  TooltipModule
} from '@coreui/angular';

import { IconModule } from '@coreui/icons-angular';

import { ChauffeurRoutingModule } from './chauffeur-routing.module';

import { ChauffeurListComponent } from './list/list.component';
import { ChauffeurAddComponent } from './add/add.component';
import { ChauffeurEditComponent } from './edit/edit.component';
import { ChauffeurDetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [
    ChauffeurListComponent,
    ChauffeurAddComponent,
    ChauffeurEditComponent,
    ChauffeurDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ChauffeurRoutingModule,

    CardModule,
    ButtonModule,
    FormModule,
    GridModule,
    TableModule,
    BadgeModule,
    AvatarModule,
    PaginationModule,
    TooltipModule,
    IconModule
  ]
})
export class ChauffeurModule {}
