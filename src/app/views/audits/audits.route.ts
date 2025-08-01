import { Route } from '@angular/router'
import { AuditsComponent } from './audits.component'
import { MapComponent } from './components/map/map.component'

export const AUDITS_ROUTES: Route[] = [
  {
    path: 'list',
    component: AuditsComponent,
    data: { title: 'Auditorias' },
  },
  {
    path: 'map/:id',
    component: MapComponent,
    data: { title: 'Mapa' },
  }
]
