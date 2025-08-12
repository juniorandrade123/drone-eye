import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const authEndpoint = 'cd';

export async function getCD() {
    const empresaId = buscaEmpresaId();
    const response = await Api.get(authEndpoint + `?empresa_id=${empresaId}`);

    return response;
}

export async function createCD(payload) {
    const response = await Api.post(authEndpoint , payload);
    return response;
}

export async function editCD(id, payload) {
    const response = await Api.put(authEndpoint + id , payload);
    return response;
}

export async function deleteCD(id) {
    const response = await Api.remove(authEndpoint + id);
    return response;
}

