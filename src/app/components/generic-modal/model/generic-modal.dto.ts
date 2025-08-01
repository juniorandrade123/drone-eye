export class GenericModalDTO {
    title: string = "Atenção!";
    message: string = "";
    messageDelete: string = "";
    item: string = "";
    descriptionBtnCancel: string = "Cancelar";
    descriptionBtnConfirm: string = "Confirmar";
    type: "success" | "warning" | "error" = "success";
}
