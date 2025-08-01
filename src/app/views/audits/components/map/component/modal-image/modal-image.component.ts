import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from "@angular/core";
import { GlobalValuesService } from "@core/services/global.values.service";
import { NgbActiveModal, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MapService } from "../../service/map.service";
import { ToastrService } from "ngx-toastr";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: "app-modal-image",
    templateUrl: "./modal-image.component.html",
    styleUrl: "./modal-image.component.scss",
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbTooltipModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalImageComponent {
    @Input() image: any
    @Input() auditId: number = 0;

    isAddCode: boolean = false;
    code: string = '';
    sendCode: boolean = false;

    constructor(
        public service: MapService,
        public activeModal: NgbActiveModal,
        public globals: GlobalValuesService,
        private toastr: ToastrService
    ) {
    }

    closeModal() {
        this.activeModal.close({ reload: false });
    }

    approvedImage() {
        this.globals.setLoading(true);
        this.service.approvedImage(this.auditId, this.image.id).subscribe(
            (result: any) => {
                this.globals.setLoading(false);
                this.activeModal.close({ reload: false });
            },
            (error: any) => {
                this.toastr.error('Ocorreu um erro ao realizar a aprovação', 'Atenção!');
                this.globals.setLoading(false);
                console.log(error);
            }
        );
    }

    reprovedImage() {
        this.globals.setLoading(true);
        this.service.reprovedImage(this.image.id).subscribe(
            (result: any) => {
                this.globals.setLoading(false);
                this.activeModal.close({ reload: false });
            },
            (error: any) => {
                this.toastr.error('Ocorreu um erro ao realizar a reprovação', 'Atenção!');
                this.globals.setLoading(false);
                console.log(error);
            }
        );
    }

    addCode() {
        this.isAddCode = true;
    }

    cancelCode() {
        this.code = '';
        this.sendCode = false;
        this.isAddCode = false;
    }

    saveCode() {
        if (this.code) {
            this.globals.setLoading(true);
            this.service.manualCode(this.image.id, this.code).subscribe(
                (result: any) => {
                    this.globals.setLoading(false);
                    this.activeModal.close({ reload: true });
                },
                (error: any) => {
                    this.toastr.error('Ocorreu um erro ao salvar', 'Atenção!');
                    this.globals.setLoading(false);
                    console.log(error);
                }
            );
        } else {
            this.toastr.error("Preencha o código", "Atenção!");
            this.sendCode = true;
        }
    }
}