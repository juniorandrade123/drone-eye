import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const VIEW_ROUTES: Route[] = [
  {
    path: 'index',
    component: DashboardComponent,
    data: { title: 'Dashboard' },
  },
  {
    path: 'audits',
    loadChildren: () =>
      import('./audits/audits.route').then((mod) => mod.AUDITS_ROUTES),
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.route').then((mod) => mod.INVENTORY_ROUTES),
  },
];
