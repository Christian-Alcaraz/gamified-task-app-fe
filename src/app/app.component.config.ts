import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  provideNgIconsConfig,
  withContentSecurityPolicy,
} from '@ng-icons/core';
import { routes } from './app.component.routes';

import { ApiErrorInterceptorDI } from '@core/interceptors/api-error/api-error.interceptor';
import { attachRequestCredentialsInterceptor } from '@core/interceptors/attach-request-credentials/attach-request-credentials.interceptor';
import { provideIcons } from '@ng-icons/core';
import * as heroIconsMicro from '@ng-icons/heroicons/micro';
import * as heroIconsMini from '@ng-icons/heroicons/mini';
import * as heroIconsOutline from '@ng-icons/heroicons/outline';
import * as heroIconsSolid from '@ng-icons/heroicons/solid';
import * as iconSaxBold from '@ng-icons/iconsax/bold';
import * as iconSaxBulk from '@ng-icons/iconsax/bulk';
import * as iconSaxOutline from '@ng-icons/iconsax/outline';
import { UserStateService } from '@shared/services/state/user.state.service';
import { NgxMaskOptions, provideEnvironmentNgxMask } from 'ngx-mask';

const compiledIcons = {
  ...iconSaxBold,
  ...iconSaxOutline,
  ...iconSaxBulk,
  ...heroIconsMicro,
  ...heroIconsMini,
  ...heroIconsOutline,
  ...heroIconsSolid,
};

const maskConfig: NgxMaskOptions = { validation: false };

const interceptorFns = [attachRequestCredentialsInterceptor];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors(interceptorFns),
      withFetch(),
      withInterceptorsFromDi(),
    ),
    provideBrowserGlobalErrorListeners(),
    provideEnvironmentNgxMask(maskConfig),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideIcons(compiledIcons),
    provideNgIconsConfig(
      {
        size: '1.5em',
      },
      withContentSecurityPolicy(),
    ),
    UserStateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiErrorInterceptorDI,
      multi: true,
    },
  ],
};
