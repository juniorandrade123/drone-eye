import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, ViewChild } from "@angular/core";
import { AuditsTableGridComponent } from "./audits-table-grid/audits-table-grid.component";
import { AuditsService } from "./service/audits.service";
import { BreadcrumbComponent } from "@component/breadcrumb/breadcrumb.component";
import { CommonModule } from "@angular/common";
import { AuditsNewEditComponent } from "./audits-new-edit/audits-new-edit.component";
import { NgbModal, NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { GlobalValuesService } from "@core/services/global.values.service";

@Component({
    selector: "app-audits",
    templateUrl: "./audits.component.html",
    imports: [CommonModule, BreadcrumbComponent, AuditsTableGridComponent, NgbModalModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [NgbModal],
})
export class AuditsComponent {
    search?: string = undefined;
    showMenuFilter: boolean = false;

    // @ViewChild(FilterMenuComponent, { static: false })
    // filterMenuComponent?: FilterMenuComponent;

    @ViewChild(AuditsTableGridComponent, { static: false })
    tableGrid?: AuditsTableGridComponent;

    filter: any;
    isFilterApplied: boolean = false;

    constructor(
        private service: AuditsService,
        private globals: GlobalValuesService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {

    }

    changeFilterMenu() {
        this.showMenuFilter = false;
        // this.filterMenuComponent?.showMenu(false);
    }

    ApplyFilter(filterObject?: any) {
        this.isFilterApplied = true;
        this.showMenuFilter = false;
        // this.filterMenuComponent?.showMenu(false);
        this.filter = filterObject;
        // this.tableGrid?.getList(filterObject);
    }

    showFilter() {
        this.showMenuFilter = true;
        // this.filterMenuComponent?.showMenu(true);
    }

    executeSearch() {
        // this.tableGrid?.resetFilter();
        // this.filter = this.tableGrid?.filter;
        // this.filter.search = this.search;
        // this.tableGrid?.getList(this.filter);
    }

    resetFilter(filterObject?: any) {
        this.search = undefined;
        this.ApplyFilter(filterObject);
        this.isFilterApplied = false;
    }

    getFilter(): any {
        // if (!this.filter) {
        //     return this.tableGrid?.filter;
        // }

        return this.filter;
    }

    openModalAdd() {
        const modal = this.modalService.open(AuditsNewEditComponent, { backdrop: "static" });
        modal.result.then((result) => {
            if (result) {
                this.tableGrid?.getTableDataByPage(0);
            }
        });
    }
}
