import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";

@Component({
    selector: "app-filter-images",
    templateUrl: "./filter-images.component.html",
    styleUrls: ["./filter-images.component.scss"],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule]
})
export class FilterImagesComponent {
    @Input()
    lstRoads: any[] = [];

    @Input()
    lstPaletes: any[] = [];

    @Input()
    auditId: number = 0;

    @Output()
    filterObject = new EventEmitter<any>();

    @Output()
    executeResetFilter = new EventEmitter();

    filter: any = {};
    form: FormGroup = this.formBuilder.group({
        auditId: [this.auditId],
        road: [null],
        palete: [null],
    });

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit() {
    }

    sendFilter() {
        this.filter.road = this.form.controls["road"].value;
        this.filter.palete = this.form.controls["palete"].value;

        if (!this.filter.road && !this.filter.palete)
            this.resetFilter();
        else
            this.filterObject.emit(this.filter);
    }

    resetFilter() {
        this.form.reset();
        this.executeResetFilter.emit();
    }
}
