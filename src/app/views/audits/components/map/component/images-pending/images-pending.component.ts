import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, input, Input, Output } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AccordionComponent } from "@component/accordion/accordion.component";
import { NgbModalModule, NgbNavModule, NgbTooltipModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { MapService } from "../../service/map.service";
import { ActivatedRoute } from "@angular/router";
import { GlobalValuesService } from "@core/services/global.values.service";
import { ToastrService } from "ngx-toastr";
import { ModalImageComponent } from "../modal-image/modal-image.component";

@Component({
    selector: "app-images-pending",
    templateUrl: "./images-pending.component.html",
    styleUrls: ['./images-pending.component.scss'],
    imports: [
        CommonModule,
        NgbModalModule,
        NgSelectModule,
        AccordionComponent,
        NgbNavModule,
        FormsModule,
        ReactiveFormsModule,
        NgbTooltipModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [NgbModal],
})
export class ImagesPendingComponent {
    @Input()
    tabIndex: number = 0;

    @Input()
    isFilterApplied: boolean = false;

    @Output()
    reloadImages = new EventEmitter();

    @Output()
    openFilter = new EventEmitter();

    isApplyFilter: boolean = false;

    auditId: number = 0;
    isLoading: boolean = false;
    lstImagesPending: any[] = [];
    filter: any = {};

    constructor(private service: MapService,
        private modalService: NgbModal,
        private activatedRoute: ActivatedRoute,
        private global: GlobalValuesService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        if (!this.activatedRoute.snapshot.paramMap.get("id")) {
            return;
        }
        this.auditId = Number(this.activatedRoute.snapshot.paramMap.get("id"));

        this.getImagesPending();
    }

    async getImagesPending(filter?: any, isApplyFilter?: boolean) {
        this.isApplyFilter = isApplyFilter ?? false;
        this.filter = filter;
        this.isLoading = true;
        await this.service.getImagesWaitingConfirmation(this.auditId, filter?.road, filter?.palete ).subscribe(
            (result: any) => {
                this.isLoading = false;
                this.lstImagesPending = result.map((i: any) => {
                    const row = i.name.split('.')[0].split('_').at(-1);
                    return {
                        ...i,
                        checked: false,
                        loading: false,
                        description: `${i.road} ${i.palete} - ${row}`,
                        row: row,
                        image: i.name,
                    };
                });
            },
            (error: any) => {
                this.isLoading = false;
                console.log(error);
            }
        );
    }

    getImageByRow(palete: string, row: number) {
        return this.lstImagesPending.find(x => x.palete === palete && `R${this.tabIndex + 1}` === x.road && Number(row) === Number(x.row))
    }

    openModal(palete: string, row: number) {
        const image = this.getImageByRow(palete, row);
        const modal = this.modalService.open(ModalImageComponent);
        modal.componentInstance.auditId = this.auditId;
        modal.componentInstance.image = image;

        modal.result.then((result) => {
            if (result) {
                this.toastr.success('Avaliação realizada com sucesso', 'Atenção!');
                this.global.setLoading(false);
                this.getImagesPending(this.filter);
                this.reloadImages.emit();
            }
        });
    }

    verifyCheckedImagePending() {
        return this.lstImagesPending.filter(x => x.checked).length === 0;
    }

    openModalFilter() {
        this.openFilter.emit();
    }
}