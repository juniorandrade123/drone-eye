import { ICONE_RELOGIO } from '@/assets/images/icons';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IndicadorInventario } from '@views/inventario/components/model/sku';

@Component({
  selector: 'app-indicadores-tempo',
  imports: [CommonModule],
  templateUrl: './indicadores-tempo.component.html',
  styleUrl: './indicadores-tempo.component.scss',
})
export class IndicadoresTempoComponent {
  @Input() indicador!: IndicadorInventario;

  iconeRelogio = this.dom.bypassSecurityTrustHtml(ICONE_RELOGIO);

  constructor(private dom: DomSanitizer) {}
}
