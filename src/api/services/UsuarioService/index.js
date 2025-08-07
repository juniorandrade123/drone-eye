import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const authEndpoint = 'usuario/';

export async function getUsers() {
    const empresaId = buscaEmpresaId();
    const response = await Api.get(authEndpoint + `?empresa_id=${empresaId}`);

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

export async function deleteUser(id) {
    const response = await Api.remove(authEndpoint + id);
    return response;
}

