import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, filter, map, tap } from 'rxjs/operators';

import { ColorModeService } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet], // keep ONLY this for template
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  title = 'CoreUI Angular Admin Template';

  readonly #destroyRef = inject(DestroyRef);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #titleService = inject(Title);
  readonly #colorModeService = inject(ColorModeService);
  readonly #iconSetService = inject(IconSetService);

  constructor() {
    this.#titleService.setTitle(this.title);
    this.#iconSetService.icons = { ...iconSubset };
    this.#colorModeService.localStorageItemName.set('coreui-theme');
    this.#colorModeService.eventName.set('ColorSchemeChange');
  }

  ngOnInit(): void {

    this.#router.events.pipe(
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(event => {
      if (!(event instanceof NavigationEnd)) return;
    });

    this.#route.queryParams.pipe(
      delay(1),
      map(params => params['theme']),
      filter(theme => ['dark', 'light', 'auto'].includes(theme)),
      tap(theme => this.#colorModeService.colorMode.set(theme)),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe();
  }
}
