import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { QueryBySkuComponent } from './components/query-by-sku/query-by-sku.component';
import { GridViewComponent } from './components/grid-view/grid-view.component';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, QueryBySkuComponent, GridViewComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent {
  selected: 'sku' | 'grid' = 'grid';
}
