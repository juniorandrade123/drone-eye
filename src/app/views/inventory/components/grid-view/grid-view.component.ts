import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Selected } from '@core/model/selected';
import { NgSelectModule } from '@ng-select/ng-select';
import { distributionCenter, streets } from '@views/inventory/data';

@Component({
  selector: 'app-grid-view',
  imports: [CommonModule, NgSelectModule, FormsModule],
  templateUrl: './grid-view.component.html',
  styleUrl: './grid-view.component.scss',
})
export class GridViewComponent {
  lstDistributionCenter: Selected[] = distributionCenter;
  lstStreets: Selected[] = [];

  selectedCD!: Selected;
  selectedStreet!: Selected;

  constructor() {}

  changeDistributionCenter(item: Selected) {
    this.lstStreets = streets.filter(s => s.value == item.value);

    console.log(this.selectedCD, 'dsad')
  }


}
