import { Route } from '@angular/router'
import { InventoryComponent } from './inventory.component'

export const INVENTORY_ROUTES: Route[] = [
  {
    path: 'index',
    component: InventoryComponent,
    data: { title: 'Consulta Inventário' },
  },
]
