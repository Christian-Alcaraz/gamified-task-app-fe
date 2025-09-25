import { Routes } from '@angular/router';
import { AdminPortalComponent } from './admin-portal.component';
import { adminPortalGuard } from './admin-portal.guard';
import { AdminPortalService } from './admin-portal.service';

export const routes: Routes = [
  {
    path: '',
    canActivate: [adminPortalGuard],
    component: AdminPortalComponent,
    providers: [AdminPortalService],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'items',
        loadComponent: () =>
          import('./pages/items/items.component').then((m) => m.ItemsComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
