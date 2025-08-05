import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaSkuComponent } from './components/consulta-sku/consulta-sku.component';
import { VisualizacaoGridComponent } from './components/visualizacao-grid/visualizacao-grid.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONE_GRID, ICONE_PESQUISA_AZUL, ICONE_PESQUISA_CINZA } from '@/assets/images/icons';

@Component({
  selector: 'app-inventario',
  imports: [CommonModule, ConsultaSkuComponent, VisualizacaoGridComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss',
})
export class inventarioComponent {
  selected: 'sku' | 'grid' = 'sku';

  iconePesquisaAzul = this.dom.bypassSecurityTrustHtml(ICONE_PESQUISA_AZUL);
  iconePesquisaCinza = this.dom.bypassSecurityTrustHtml(ICONE_PESQUISA_CINZA);
  iconeGrid = this.dom.bypassSecurityTrustHtml(ICONE_GRID);

  constructor(private dom: DomSanitizer){}
}
