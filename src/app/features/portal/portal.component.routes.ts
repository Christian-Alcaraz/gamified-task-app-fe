import { Routes } from '@angular/router';
import { PortalComponent } from './portal.component';
import { portalGuard } from './portal.guard';

export const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    canActivate: [portalGuard],
    children: [
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/tasks/tasks.component').then((m) => m.TasksComponent),
      },
      {
        path: 'party',
        loadComponent: () =>
          import('./pages/party/party.component').then((m) => m.PartyComponent),
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
