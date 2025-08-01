import { Component, Input } from "@angular/core";
import { Validators, FormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuditsService } from "../service/audits.service";
import { CommonModule } from "@angular/common";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { GlobalValuesService } from "@core/services/global.values.service";

@Component({
    selector: "app-audits-new-edit",
    templateUrl: "./audits-new-edit.component.html",
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AuditsNewEditComponent {
    @Input() id: number = 0;

    form: UntypedFormGroup = this.formBuilder.group({
        id: [0],
        description: [null, Validators.required],
        pilot: [null, Validators.required],
        license: [null, Validators.required],
        document: [null, Validators.required],
        authorization: [null, Validators.required],
    });

    sendform = false;
    loading = false;
    isAdd = true;

    constructor(
        private toastr: ToastrService,
        private service: AuditsService,
        public router: Router,
        private formBuilder: FormBuilder,
        public activeModal: NgbActiveModal,
        private global: GlobalValuesService
    ) { }

    ngOnInit() {
        this.loadQueryRoute();
    }

    loadQueryRoute() {
        this.isAdd = this.id === 0;

        if (this.id !== 0)
            this.loadFields();
    }

    loadFields() {
        this.global.setLoading(true);
        this.service.getAuditById(this.id).subscribe(
            (result: any) => {
                this.global.setLoading(false);

                if (!result) {
                    this.toastr.error("Erro ao buscar os dados de auditoria", "Atenção!");
                    this.closeModal();
                    return;
                }

                this.loadDataFields(result);
            },
            (error: any) => {
                this.global.setLoading(false);
                console.log(error);
            }
        );
    }

    loadDataFields(data: any) {
        this.form.controls["id"].setValue(data.id);
        this.form.controls["description"].setValue(data.description);
        this.form.controls["pilot"].setValue(data.pilot);
        this.form.controls["license"].setValue(data.license);
        this.form.controls["document"].setValue(data.document);
        this.form.controls["authorization"].setValue(data.authorization);
    }

    save() {
        if (this.form.valid) {
            const model = this.populeModelToSave();

            if (model.id === 0) {
                this.add(model);
            } else {
                this.update(model);
            }
        } else {
            this.toastr.error("Preencha todos os campos obrigatórios!", "Atenção!");
            this.sendform = true;
        }
    }

    add(model: any) {
        this.loading = true;
        this.service.add(model).subscribe(
            (result: any) => {
                this.loading = false;
                if (result) {
                    this.toastr.success("Auditoria salva com sucesso!", "Atenção!");
                    this.activeModal.close(true);
                } else {
                    this.toastr.success("Erro ao salvar auditoria!", "Atenção!");
                    this.activeModal.close(false);
                }

                this.clearRequest();
            },
            (error: any) => {
                this.clearRequest();
                console.log(error);
            }
        );
    }

    update(model: any) {
        this.loading = true;
        this.service.update(model, this.id).subscribe(
            (result: any) => {
                this.loading = false;
                
                if (result) {
                    this.toastr.success("Auditoria atualizada com sucesso!", "Atenção!");
                    this.activeModal.close(true);
                } else {
                    this.toastr.error("Erro ao atualizar auditoria!", "Atenção!");
                    this.activeModal.close(false);
                }

                this.clearRequest();
            },
            (error: any) => {
                console.log(error);
                this.clearRequest();
            }
        );
    }

    populeModelToSave(): any {
        const model: any = {};
        model.id = this.id;
        model.description = this.form.controls["description"].value;
        model.pilot = this.form.controls["pilot"].value;
        model.license = this.form.controls["license"].value;
        model.document = this.form.controls["document"].value;
        model.authorization = this.form.controls["authorization"].value;

        return model;
    }

    clearRequest() {
        this.sendform = false;
    }

    closeModal() {
        this.activeModal.close(false);
    }
}
