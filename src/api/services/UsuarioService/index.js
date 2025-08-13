import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const authEndpoint = 'usuario/';

export async function getUsers(incluirInativos) {
    const empresaId = buscaEmpresaId();
    const response = await Api.get(authEndpoint + `?empresa_id=${empresaId}&incluir_inativos=${incluirInativos}`);

    return response;
}

export async function createUser(payload) {
    const response = await Api.post(authEndpoint , payload);
    return response;
}

export async function editUser(id, payload) {
    const response = await Api.put(authEndpoint + id , payload);
    return response;
}

export async function toggleStatusUser(id, payload) {
    const response = await Api.patch(authEndpoint + `${id}/status` , payload);
    return response;
}

