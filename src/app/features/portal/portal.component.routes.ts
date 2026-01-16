import { Routes } from '@angular/router';
import { EPortalNavRouteName } from '@core/constants';
import { PortalComponent } from './portal.component';
import { portalGuard } from './portal.guard';

export const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    canActivate: [portalGuard],
    children: [
      {
        path: EPortalNavRouteName.Tasks,
        loadComponent: () =>
          import('./pages/tasks/tasks.component').then((m) => m.TasksComponent),
      },
      {
        path: EPortalNavRouteName.Party,
        loadComponent: () =>
          import('./pages/party/party.component').then((m) => m.PartyComponent),
      },
      {
        path: EPortalNavRouteName.Shop,
        loadComponent: () =>
          import('./pages/shop/shop.component').then((m) => m.ShopComponent),
      },
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
    ],
  },
];
