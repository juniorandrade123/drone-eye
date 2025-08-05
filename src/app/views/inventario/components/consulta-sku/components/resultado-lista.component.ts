import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { skuResum, skus } from '@views/inventario/data';
import { SkuDto, SkuResum } from '../../model/sku';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONE_CAIXA_AZUL, ICONE_CALENDARIO, ICONE_CAMERA, ICONE_LOCALIZACAO, ICONE_OLHO } from '@/assets/images/icons';

@Component({
  selector: 'app-resultado-lista',
  imports: [CommonModule, NgSelectModule, FormsModule],
  templateUrl: './resultado-lista.component.html',
  styleUrl: './resultado-lista.component.scss',
})
export class ResultadoListaComponent {
  @Input() lstSkus: SkuDto[] = skus;
  @Input() resumQuery: SkuResum = skuResum;

  iconeCaixaAzul = this.dom.bypassSecurityTrustHtml(ICONE_CAIXA_AZUL);
  iconeOlho = this.dom.bypassSecurityTrustHtml(ICONE_OLHO);
  iconeLocalizacao = this.dom.bypassSecurityTrustHtml(ICONE_LOCALIZACAO);
  iconeCalendario = this.dom.bypassSecurityTrustHtml(ICONE_CALENDARIO);
  iconeCamera = this.dom.bypassSecurityTrustHtml(ICONE_CAMERA);

  constructor(private dom: DomSanitizer) {}
}
