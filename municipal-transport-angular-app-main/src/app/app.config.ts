import { ApplicationConfig } from '@angular/core';
<<<<<<< HEAD
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
=======
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  PreloadAllModules,
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions
} from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';
<<<<<<< HEAD
import { AuthInterceptor } from './auth/auth.interceptor';
=======
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withViewTransitions()
    ),
    IconSetService,
    provideAnimationsAsync(),
<<<<<<< HEAD
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
=======
    provideHttpClient(withFetch(), withInterceptorsFromDi())
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
  ]
};
