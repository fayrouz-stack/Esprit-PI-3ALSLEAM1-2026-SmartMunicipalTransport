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
  TooltipModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

import { AffectationRoutingModule } from './affectation-routing.module';
import { AffectationListComponent } from './list/list.component';
import { AffectationFormComponent } from './form/form.component';
import { AffectationPlanningComponent } from './planning/planning.component';
import { AffectationDetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [
    AffectationListComponent,
    AffectationFormComponent,
    AffectationPlanningComponent,
    AffectationDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AffectationRoutingModule,
    CardModule,
    ButtonModule,
    FormModule,
    GridModule,
    TableModule,
    BadgeModule,
    TooltipModule,
    IconModule
  ]
})
export class AffectationModule {}
