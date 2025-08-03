import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.component').then((c) => c.LoginComponent),
      },
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./sign-up/sign-up.component').then((c) => c.SignUpComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },
];
