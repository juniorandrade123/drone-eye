import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, ViewChild } from "@angular/core";
import { BreadcrumbComponent } from "@component/breadcrumb/breadcrumb.component";
import { CommonModule } from "@angular/common";
import { NgbModal, NgbModalModule, NgbNavModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { FileUploaderComponent } from "@component/file-uploader/file-uploader.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { MapService } from "./service/map.service";
import { AccordionComponent } from "@component/accordion/accordion.component";
import { ModalImageComponent } from "./component/modal-image/modal-image.component";
import { ActivatedRoute } from "@angular/router";
import { GlobalValuesService } from "@core/services/global.values.service";
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ImagesPendingComponent } from "./component/images-pending/images-pending.component";
import { FilterMenuComponent } from "@component/filter-menu/filter-menu.component";
import { FilterImagesComponent } from "./component/filter-images/filter-images.component";

@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ['./map.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        NgbModalModule,
        FileUploaderComponent,
        NgSelectModule,
        AccordionComponent,
        NgbNavModule,
        FormsModule,
        ReactiveFormsModule,
        NgbTooltipModule,
        ImagesPendingComponent,
        FilterMenuComponent,
        FilterImagesComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [NgbModal],
})
export class MapComponent {
    //scroll
    isDown = false;
    startX = 0;
    scrollLeft = 0;

    tabIndex: number = 0;
    auditId: number = 0;
    isLoading: boolean = false;
    isStartsCollapsed: boolean = true;

    numberRow: number = 21;
    lstRows: any[] = [];

    lstRoads: any[] = [];
    loadingRoads: boolean = false;

    lstPaletes: any[] = [];
    loadingPaletes: boolean = false;

    lstImages: any[] = [];

    sendform: boolean = false;
    form: UntypedFormGroup = this.formBuilder.group({
        road: [null, Validators.required],
        palete: [null, Validators.required],
    });
    @ViewChild(AccordionComponent, { static: false }) accordionComponent:
        | AccordionComponent
        | undefined;

    @ViewChild(FileUploaderComponent, { static: false }) uploadComponent:
        | FileUploaderComponent
        | undefined;

    @ViewChild(ImagesPendingComponent, { static: false }) imagesPendingComponent:
        | ImagesPendingComponent
        | undefined;

    @ViewChild(FilterMenuComponent, { static: false }) filterMenuComponent:
        | FilterMenuComponent
        | undefined;;

    @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

    intervalId = 0;
    seconds = 60;
    isStop = false;
    timestamp = new Date().getTime();
    isFilterApplied: boolean = false;

    showMenuFilter: boolean = false;

    constructor(private service: MapService,
        private modalService: NgbModal,
        private activatedRoute: ActivatedRoute,
        private global: GlobalValuesService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService
    ) { }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        if (!this.scrollContainer?.nativeElement.contains(event.target)) return;
        this.isDown = true;
        this.startX = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
        this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
        this.scrollContainer.nativeElement.style.cursor = 'grabbing';
    }

    @HostListener('document:mouseup')
    onMouseUp() {
        this.isDown = false;
        this.scrollContainer.nativeElement.style.cursor = 'grab';
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (!this.isDown) return;
        event.preventDefault();
        const x = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
        const walk = (x - this.startX) * 1.5;
        this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
    }

    ngOnInit() {
        this.start();
        if (!this.activatedRoute.snapshot.paramMap.get("id")) {
            return;
        }
        this.auditId = Number(this.activatedRoute.snapshot.paramMap.get("id"));

        this.loadData();
    }

    ngOnDestroy() { this.clearTimer(); }

    async loadData() {
        await this.getImages();
        this.getRoads();
        this.getPaletes();

        for (let index = 1; index < this.numberRow; index++) {
            this.lstRows.push({ value: ('00' + index).slice(-2) });
        }
    }

    async getImages() {
        this.seconds = 60;
        this.start();

        this.imagesPendingComponent?.getImagesPending();
        this.global.setLoading(true);
        this.isLoading = true;
        await this.service.getImages(this.auditId).subscribe(
            (result: any) => {
                this.isLoading = false;
                this.global.setLoading(false);
                this.lstImages = result.filter((x: any) => x.status !== 'WAITING_CONFIRMATION' && x.status !== 'CANCELED').map((i: any) => {
                    const row = i.name.split('.')[0].split('_').at(-1);
                    return {
                        ...i,
                        loading: false,
                        row: row,
                        image: i.name,
                    };
                });
            },
            (error: any) => {
                this.isLoading = false;
                this.global.setLoading(false);
                console.log(error);
            }
        );
    }

    getRoads() {
        this.loadingRoads = true;
        this.service.getRoads().subscribe(
            (result: any) => {
                this.lstRoads = result.map((x: any, index: number) => {
                    return { value: index, description: x };
                });

                this.loadingRoads = false;
            },
            (error: any) => {
                this.loadingRoads = false;
                console.log(error);
            }
        );
    }

    getPaletes() {
        this.loadingPaletes = true;
        this.service.getPaletes().subscribe(
            (result: any) => {
                this.lstPaletes = result.map((x: any, index: number) => {
                    return { value: index, description: x };
                });
                this.loadingPaletes = false;
            },
            (error: any) => {
                this.loadingPaletes = false;
                console.log(error);
            }
        );
    }

    getPaletesByRoad() {
        if (this.loadingPaletes) return;
        return this.lstPaletes.map(p => {
            return p.description;
        }).filter(x => !!x);
    }

    openModal(palete: string, row: number) {
        this.stop();
        const image = this.getImageByRow(palete, row);
        const modal = this.modalService.open(ModalImageComponent);
        modal.componentInstance.auditId = this.auditId;
        modal.componentInstance.image = image;

        modal.result.then((result) => {
            const { reload } = result;
            if (reload) {
                this.reladoImageById(palete, row);
            } else
                this.start();
        });
    }

    getImageByRow(palete: string, row: number) {
        return this.lstImages.find(x => x.palete === palete && `R${this.tabIndex + 1}` === x.road && Number(row) === Number(x.row));
    }

    verifyImagePending(palete: string, row: number) {
        return this.imagesPendingComponent?.lstImagesPending.find(x => x.palete === palete && `R${this.tabIndex + 1}` === x.road && Number(row) === Number(x.row));
    }

    cancel() {
        this.uploadComponent?.cleanFiles();
        this.form.reset();
        if (!this.accordionComponent?.isPanelCollapsed)
            this.accordionComponent?.togglePanelCollapse();
    }

    save() {
        const images = this.uploadComponent?.uploadedFiles || [];
        if (this.form.valid && images.length > 0) {
            this.upload(this.form.controls['road'].value, this.form.controls['palete'].value);
        } else {
            this.toastr.error("Preencha todos os campos obrigatórios!", "Atenção!");
            this.sendform = true;
        }
    }

    async upload(road: string, palete: string) {
        const formData = new FormData();
        this.uploadComponent?.uploadedFiles.forEach(image => {
            formData.append("files", image);
        });

        this.global.setLoading(true);
        this.stop();
        await this.service.upload(formData, this.auditId, road, palete).subscribe(
            (response: any) => {
                this.toastr.success("Importação realizada com sucesso!", "Atenção!");
                this.cancel();
                this.global.setLoading(false);
                this.getImages();
            },
            (err: any) => {
                this.global.setLoading(false);
                console.error(err);
            }
        );
    }

    reloadImage(palete: string, row: number) {
        const image = this.getImageByRow(palete, row);
        image.loading = true;
        this.timestamp = new Date().getTime();
    }

    successImage(palete: string, row: number) {
        const image = this.getImageByRow(palete, row);
        image.loading = false;
    }

    reladoImageById(palete: string, row: number) {
        const image = this.getImageByRow(palete, row);
        image.loading = true;

        this.service.getImageById(image.id).subscribe(
            (result: any) => {

                const imageUpdate = this.getImageByRow(palete, row);
                imageUpdate.loading = false;
                if (result) {
                    imageUpdate.status = result.status;
                    imageUpdate.code = result.code;
                    imageUpdate.manual_code = result.manual_code;
                }

                this.toastr.success('Código inserido com sucesso', 'Atenção!');
                this.start();
            },
            (error: any) => {
                this.start();
                console.log(error);
            });
    }

    //COUNTDOWN
    clearTimer() { clearInterval(this.intervalId); }

    start() {
        this.isStop = false;
        this.countDown();
    }

    stop() {
        this.isStop = true;
        this.clearTimer();
    }

    private countDown() {
        this.clearTimer();
        this.intervalId = window.setInterval(() => {
            this.seconds -= 1;
            if (this.seconds === 0) {
            } else {
                if (this.seconds < 0) {
                    this.getImages();
                    this.seconds = 60;
                }
            }
        }, 1000);
    }

    changeFilterMenu() {
        this.showMenuFilter = false;
        this.filterMenuComponent?.showMenu(false);
    }

    ApplyFilter(filterObject?: any) {
        this.isFilterApplied = true;
        this.showMenuFilter = false;
        this.filterMenuComponent?.showMenu(false);
        this.imagesPendingComponent?.getImagesPending(filterObject, true);
    }

    showFilter() {
        this.showMenuFilter = true;
        this.filterMenuComponent?.showMenu(true);
    }

    resetFilter() {
        this.changeFilterMenu();
        this.imagesPendingComponent?.getImagesPending();
    }
}
