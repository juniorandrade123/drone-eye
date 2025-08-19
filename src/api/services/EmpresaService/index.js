import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const authEndpoint = 'empresa';

export async function getEmpresas(limit = 100) {
    const empresaId = buscaEmpresaId();
    const response = await Api.get(authEndpoint + `?limit=${limit}`);

    return response;
}

export async function getEmpresaById(empresaId) {
    const response = await Api.get(authEndpoint + `?empresa_id=${empresaId}`);

    return response;
}

export async function createEmpresa(payload) {
    const response = await Api.post(authEndpoint , payload);
    return response;
}

export async function editEmpresa(empresaId, payload) {
    const response = await Api.patch(authEndpoint + `/${empresaId}`, payload);
    return response;
}

export async function deleteEmpresa(id) {
    const response = await Api.remove(authEndpoint + `/${id}`);
    return response;
}

