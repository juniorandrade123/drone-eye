import { Route } from '@angular/router'
import { inventarioComponent } from './inventario.component'

export const INVENTARIO_ROUTES: Route[] = [
  {
    path: 'index',
    component: inventarioComponent,
    data: { title: 'Consulta Inventário' },
  },
]
