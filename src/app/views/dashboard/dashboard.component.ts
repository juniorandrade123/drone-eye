import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PerformanceComponent } from './components/performance/performance.component';
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { DashboardCardsComponent } from './components/dashboard-cards/dashboard-cards.component';
import { CdStatusComponent } from './components/cd-status/cd-status.component';
import { InventarioAlertasComponent } from './components/inventario-alertas/inventario-alertas.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardCardsComponent,
    CdStatusComponent,
    InventarioAlertasComponent
],
  templateUrl: './dashboard.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class DashboardComponent {
}
