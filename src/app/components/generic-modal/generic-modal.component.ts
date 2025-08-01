import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { GenericModalDTO } from "./model/generic-modal.dto";

@Component({
    selector: "app-generic-modal",
    templateUrl: "./generic-modal.component.html",
    imports: [CommonModule],
})
export class GenericModalComponent {
    @Input()
    data: GenericModalDTO = new GenericModalDTO();

    constructor(
        public activeModal: NgbActiveModal,
    ) { }

    ngOnInit() {
    }

    confirm() {
        this.activeModal.close(true);
    }

    closeModal() {
        this.activeModal.close(false);
    }
}
