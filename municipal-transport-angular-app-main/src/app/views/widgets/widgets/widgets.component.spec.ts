// Ajoutez ces imports en haut
import 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CardModule, GridModule, ProgressModule, WidgetModule } from '@coreui/angular';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { iconSubset } from '../../../icons/icon-subset';
import { WidgetsBrandComponent } from '../widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets-dropdown/widgets-dropdown.component';
import { WidgetsEComponent } from '../widgets-e/widgets-e.component';
import { WidgetsComponent, DocsExampleComponent, DocsComponentsComponent } from './widgets.component';

describe('WidgetsComponent', () => {
  let component: WidgetsComponent;
  let fixture: ComponentFixture<WidgetsComponent>;
  let iconSetService: IconSetService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WidgetModule, 
        ProgressModule, 
        GridModule, 
        CardModule, 
        ChartjsModule, 
        IconModule, 
        WidgetsComponent,
        DocsExampleComponent,
        DocsComponentsComponent,
        WidgetsBrandComponent, 
        WidgetsDropdownComponent, 
        WidgetsEComponent
      ],
      providers: [IconSetService, provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true
    });
    
    iconSetService = TestBed.inject(IconSetService);
    iconSetService.icons = { ...iconSubset };

    fixture = TestBed.createComponent(WidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});