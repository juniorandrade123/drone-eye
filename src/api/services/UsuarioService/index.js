import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const authEndpoint = 'usuario';

export async function getUsers() {
    const empresaId = buscaEmpresaId();
    const response = await Api.get(authEndpoint + `/?empresa_id=${empresaId}`);

    return response;
}