import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NgbDropdownModule, NgbModal, NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { AuditsService } from "../service/audits.service";
import { Router, RouterLink } from "@angular/router";
import { GlobalValuesService } from "@core/services/global.values.service";
import { AuditsNewEditComponent } from "../audits-new-edit/audits-new-edit.component";
import { GenericModalComponent } from "@component/generic-modal/generic-modal.component";
import { GenericModalDTO } from "@component/generic-modal/model/generic-modal.dto";
import { GridPaginationComponent } from "@component/grid-pagination/grid-pagination.component";

@Component({
  selector: "app-audits-table-grid",
  templateUrl: "./audits-table-grid.component.html",
  imports: [CommonModule, NgbDropdownModule, NgbPaginationModule, NgbTooltipModule, RouterLink, GridPaginationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuditsTableGridComponent {
  public filter: any = {};
  public tableList: any[] = [];
  public tableRequestReturned = false;
  public totalItemsCount = 0;
  public itemsPerPageFixed = 10;
  public selectedPageIndex = 0;

  constructor(
    private toastr: ToastrService,
    private globals: GlobalValuesService,
    private service: AuditsService,
    public router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.resetFilter();
    this.getTableDataByPage(0);
  }

  resetFilter() {
    this.filter = {
      offset: 0,
      limit: this.itemsPerPageFixed,
      search: undefined,
    };
  }

  getTableDataByPage(index: any) {
    this.tableRequestReturned = false;
    this.filter.offset = Number(index);
    this.selectedPageIndex = Number(index);
    this.getList(this.filter);
  }

  changeQty(index: any) {
    this.filter.offset = Number(index);
    this.getTableDataByPage(0);
  }

  getList(objFilter?: any) {
    this.globals.setLoading(false);
    this.service.getAudits(objFilter?.limit ?? 10, objFilter?.offset ?? 0).subscribe(
      (result: any) => {
        this.totalItemsCount = result.count;
        this.tableList = result.items;
        this.tableRequestReturned = true;
        this.globals.setLoading(false);
      },
      (error: any) => {
        this.globals.setLoading(false);
        this.tableRequestReturned = true;
        console.log(error);
        this.toastr.error("Erro ao retornar auditorias", "Atenção!");
      }
    );
  }

  edit(item: any) {
    const modal = this.modalService.open(AuditsNewEditComponent, { backdrop: "static" });
    modal.componentInstance.id = item.id;
    modal.result.then((result) => {
      if (result) {
        this.getTableDataByPage(0);
      }
    });
  }

  remove(item: any) {
    const dto: GenericModalDTO = new GenericModalDTO();
    dto.message = 'Deseja realmente excluir essa Auditoria';
    dto.item = `${item.description}?`;
    dto.type = "error";

    const modal = this.modalService.open(GenericModalComponent, { backdrop: "static" });
    modal.componentInstance.data = dto;
    modal.result.then((result) => {
      if (result) {
        this.delete(item.id);
      }
    });
  }

  delete(id: number) {
    this.globals.setLoading(true);
    this.service.delete(id).subscribe(
      (result: any) => {
        this.toastr.success("Auditoria deletada com sucesso", "Atenção!");
        this.globals.setLoading(false);
        this.getTableDataByPage(0);
      },
      (error: any) => {
        this.globals.setLoading(false);
        console.log(error);
        this.toastr.error("Erro ao deletar auditoria", "Atenção!");
      }
    );
  }

  export(id: number) {
    this.globals.setLoading(true);
    this.service.exportExcel(id, "Imagens Auditoria").subscribe(
      (node: any) => {
        this.globals.setLoading(false);
        const url = window.URL.createObjectURL(node.data);
        const hiddenLink = document.createElement("a");
        document.body.appendChild(hiddenLink);
        hiddenLink.setAttribute("style", "display: none");
        hiddenLink.href = url;
        hiddenLink.download = node.filename;
        hiddenLink.click();
        window.URL.revokeObjectURL(url);
        hiddenLink.remove();
      },
      (error) => {
        this.globals.setLoading(false);
      }
    );
  }
}
