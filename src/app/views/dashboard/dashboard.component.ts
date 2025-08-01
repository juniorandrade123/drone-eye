import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PerformanceComponent } from './components/performance/performance.component';
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-dashboard',
  imports: [
    PerformanceComponent,
    BreadcrumbComponent
],
  templateUrl: './dashboard.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class DashboardComponent {
}
