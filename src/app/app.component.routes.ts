import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.component.routes').then((m) => m.routes),
  },
  {
    path: 'portal',
    loadChildren: () =>
      import('./features/portal/portal.component.routes').then((m) => m.routes),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'auth',
  },
];
