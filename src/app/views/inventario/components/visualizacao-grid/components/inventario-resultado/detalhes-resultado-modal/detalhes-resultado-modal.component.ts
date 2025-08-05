import { ICONE_CAMERA_AZUL } from '@/assets/images/icons';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaletesDto } from '@views/inventario/components/model/sku';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalhes-resultado-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './detalhes-resultado-modal.component.html',
  styleUrl: './detalhes-resultado-modal.component.scss',
})
export class DetalhesResultadoModalComponent {
  @Input() dadosPalete!: PaletesDto;

  codigoManual!: string;
  loading: boolean = false;

  iconeCameraAzul = this.dom.bypassSecurityTrustHtml(ICONE_CAMERA_AZUL);

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private dom: DomSanitizer,
  ) {
    console.log(this.dadosPalete);
  }

  fecharModal() {
    this.activeModal.close(false);
  }

  limpar() {
    this.codigoManual = '';
  }

  salvarCodigo() {
    if (!this.codigoManual) {
      this.toastr.error('Preencha o código corretamente', 'Atenção!');
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      this.toastr.success('Código atualizado com sucesso', 'Atenção!');
      this.activeModal.close(true);
    }, 3000);
  }
}
