import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  provideNgIconLoader,
  provideNgIconsConfig,
  withCaching,
  withContentSecurityPolicy,
} from '@ng-icons/core';
import { routes } from './app.component.routes';
import { HttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNgIconsConfig(
      {
        size: '1.5em',
      },
      withContentSecurityPolicy(),
    ),
    provideNgIconLoader((name) => {
      const http = inject(HttpClient);
      return http.get(`/assets/icons/${name}.svg`, { responseType: 'text' });
    }, withCaching()),
  ],
};
