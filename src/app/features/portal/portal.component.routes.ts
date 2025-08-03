import { Routes } from '@angular/router';
import { PortalComponent } from './portal.component';

export const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      {
        path: 'hub',
        loadComponent: () =>
          import('./pages/hub/hub.component').then((m) => m.HubComponent),
      },
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
        redirectTo: 'hub',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'hub',
        pathMatch: 'full',
      },
    ],
  },
];
