import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { WidgetsBrandComponent } from '../widgets-brand/widgets-brand.component';
import { IconDirective } from '@coreui/icons-angular';
import { WidgetsEComponent } from '../widgets-e/widgets-e.component';
import { WidgetsDropdownComponent } from '../widgets-dropdown/widgets-dropdown.component';
// Supprimez cette ligne - elle cause l'erreur
// import { DocsComponentsComponent, DocsExampleComponent } from '@docs-components/public-api';
import {
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  CardHeaderComponent,
  ColComponent,
  ProgressComponent,
  RowComponent,
  TemplateIdDirective,
  WidgetStatBComponent,
  WidgetStatCComponent,
  WidgetStatFComponent
} from '@coreui/angular';

// Créez des composants factices si nécessaire
@Component({
  selector: 'app-docs-example',
  template: '<ng-content></ng-content>',
  //standalone: true
})
export class DocsExampleComponent {}

@Component({
  selector: 'app-docs-components',
  template: '<ng-content></ng-content>',
 //standalone: true
})
export class DocsComponentsComponent {}

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    CardComponent, 
    CardHeaderComponent, 
    CardBodyComponent, 
    DocsExampleComponent,  // Maintenant disponible
    WidgetsDropdownComponent, 
    RowComponent, 
    ColComponent, 
    WidgetStatBComponent, 
    ProgressComponent, 
    WidgetsEComponent, 
    WidgetStatFComponent, 
    TemplateIdDirective, 
    IconDirective, 
    WidgetsBrandComponent, 
    CardGroupComponent, 
    WidgetStatCComponent, 
    DocsComponentsComponent  // Maintenant disponible
  ]
})
export class WidgetsComponent implements AfterContentInit {
  private changeDetectorRef = inject(ChangeDetectorRef);

  fleetStats = {
    vehicles: 42,
    drivers: 38,
    trips: 1247,
    mileage: 15432,
    punctuality: 94,
    maintenance: 3
  };

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}