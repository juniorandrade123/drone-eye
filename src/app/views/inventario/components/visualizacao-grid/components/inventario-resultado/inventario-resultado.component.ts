import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  PaletesDto,
  PaleteStatusEnum,
  SkuGridView,
} from '@views/inventario/components/model/sku';
import { DetalhesResultadoModalComponent } from './detalhes-resultado-modal/detalhes-resultado-modal.component';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONE_CAIXA_AZUL, ICONE_CAMERA, ICONE_CLICK, ICONE_LIDO, ICONE_VAZIO } from '@/assets/images/icons';

@Component({
  selector: 'app-inventario-resultado',
  imports: [CommonModule, NgbModalModule],
  templateUrl: './inventario-resultado.component.html',
  styleUrl: './inventario-resultado.component.scss',
})
export class InventarioResultadoComponent {
  @Input() dadosRua!: SkuGridView;

  iconeCaixa = this.dom.bypassSecurityTrustHtml(ICONE_CAIXA_AZUL);
  iconeLido = this.dom.bypassSecurityTrustHtml(ICONE_LIDO);
  iconeCamera = this.dom.bypassSecurityTrustHtml(ICONE_CAMERA);
  iconeClick = this.dom.bypassSecurityTrustHtml(ICONE_CLICK);
  iconeVazio = this.dom.bypassSecurityTrustHtml(ICONE_VAZIO);

  constructor(private modalService: NgbModal, private dom: DomSanitizer) {}

  getClasses(paletes: PaletesDto[], status: PaleteStatusEnum): string[] {
    const classes: string[] = [];

    const maxCols = 3;
    const col = Math.floor(12 / Math.min(paletes.length, maxCols));
    classes.push(`col-${col}`);

    if (status === PaleteStatusEnum.SUCESSO) {
      classes.push('success');
    } else if (status === PaleteStatusEnum.ERRO_LEITURA) {
      classes.push('warning');
    } else if (status === PaleteStatusEnum.SEM_LEITURA) {
      classes.push('default-sku');
    }

    return classes;
  }

  detalhesModal(palete: PaletesDto) {
    const modal = this.modalService.open(DetalhesResultadoModalComponent, {
      backdrop: 'static',
      size: 'lg',
    });
    modal.componentInstance.dadosPalete = palete;
    modal.result.then((result) => {
      if (result) {
      }
    });
  }
}
