import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import {
  provideNgIconsConfig,
  withContentSecurityPolicy,
} from '@ng-icons/core';
import { routes } from './app.component.routes';

import { provideIcons } from '@ng-icons/core';
import * as heroIconsMicro from '@ng-icons/heroicons/micro';
import * as heroIconsMini from '@ng-icons/heroicons/mini';
import * as heroIconsOutline from '@ng-icons/heroicons/outline';
import * as heroIconsSolid from '@ng-icons/heroicons/solid';
import * as iconSaxBold from '@ng-icons/iconsax/bold';
import * as iconSaxBulk from '@ng-icons/iconsax/bulk';
import * as iconSaxOutline from '@ng-icons/iconsax/outline';

const compiledIcons = {
  ...iconSaxBold,
  ...iconSaxOutline,
  ...iconSaxBulk,
  ...heroIconsMicro,
  ...heroIconsMini,
  ...heroIconsOutline,
  ...heroIconsSolid,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideIcons(compiledIcons),
    provideNgIconsConfig(
      {
        size: '1.5em',
      },
      withContentSecurityPolicy(),
    ),
  ],
};
