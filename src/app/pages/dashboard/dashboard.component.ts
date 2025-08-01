import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AlertsComponent } from './alerts/alerts.component';
import { DistributionStatusComponent } from './distribution-status/distribution-status.component';
import { HeaderComponent } from '../../components/header/header.component';
import { IndicatorsComponent } from './indicators/indicators.component';
import { InventoriesComponent } from './inventories/inventories.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    HeaderComponent,
    IndicatorsComponent,
    DistributionStatusComponent,
    InventoriesComponent,
    AlertsComponent,
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {}
