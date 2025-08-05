import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Selected } from '@core/model/selected';
import { NgSelectModule } from '@ng-select/ng-select';
import { distributionCenter, resultsViewGrid, streets } from '@views/inventario/data';
import { IndicadoresTempoComponent } from './components/indicadores-tempo/indicadores-tempo.component';
import { InventarioResultadoComponent } from './components/inventario-resultado/inventario-resultado.component';
import { SkuGridView } from '../model/sku';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONE_CLICK, ICONE_LIDO, ICONE_LOCALIZACAO_AZUL, ICONE_LOCALIZACAO_CINZA, ICONE_NAO_LIDO, ICONE_VAZIO } from '@/assets/images/icons';

@Component({
  selector: 'app-visualizacao-grid',
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    IndicadoresTempoComponent,
    InventarioResultadoComponent,
  ],
  templateUrl: './visualizacao-grid.component.html',
  styleUrl: './visualizacao-grid.component.scss',
})
export class VisualizacaoGridComponent {
  lstDistributionCenter: Selected[] = distributionCenter;
  lstStreets: Selected[] = [];

  selectedCD!: Selected;
  selectedStreet!: Selected;

  resultsViewGrid: SkuGridView = resultsViewGrid;

  iconeLocalizacaoAzul = this.dom.bypassSecurityTrustHtml(ICONE_LOCALIZACAO_AZUL);
  iconeLido = this.dom.bypassSecurityTrustHtml(ICONE_LIDO);
  iconeNaoLido = this.dom.bypassSecurityTrustHtml(ICONE_NAO_LIDO);
  iconeVazio = this.dom.bypassSecurityTrustHtml(ICONE_VAZIO);
  iconeClick = this.dom.bypassSecurityTrustHtml(ICONE_CLICK);
  iconeLocalizacaoCinza = this.dom.bypassSecurityTrustHtml(ICONE_LOCALIZACAO_CINZA);

  constructor(private dom: DomSanitizer) {}

  changeDistributionCenter(item: Selected) {
    this.lstStreets = streets.filter((s) => s.value == item.value);

    console.log(this.selectedCD, 'dsad');
  }
}
