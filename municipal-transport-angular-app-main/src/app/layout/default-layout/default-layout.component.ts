import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { ViolenceDetectionService } from '../../services/violence-detection.service';
import { navItems } from './_nav';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    NgScrollbar,
    SidebarFooterComponent,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    DefaultFooterComponent,
    RouterOutlet,
    SidebarBrandComponent,
    SidebarNavComponent,
    IconDirective,
    NgIf
  ],

  // ❌ REMOVED: imports array (this was causing your bug)
})
export class DefaultLayoutComponent {
  public navItems = [...navItems];
  public violenceDetected = false;
  public readonly violenceDetectionService = inject(ViolenceDetectionService);

  constructor() {
    this.violenceDetectionService.violenceDetected$.subscribe((value) => {
      this.violenceDetected = value;
    });
  }
}
