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
    loadComponent: () =>
      import('./features/portal/portal.component').then(
        (c) => c.PortalComponent,
      ),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'auth',
  },
];
