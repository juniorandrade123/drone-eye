import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const empresaId = buscaEmpresaId();
const authEndpoint = `empresas/${empresaId}/cds`;

export async function getCategorias(id_cd, ativo) {
    const params = new URLSearchParams();

    if (typeof ativo === 'boolean') params.append('ativo', ativo);

    const response = await Api.get(`${authEndpoint}/${id_cd}/categorias-armazenagem?${params.toString()}`);
    return response;
}

export async function createCategoria(id_cd, payload) {
    const response = await Api.post(`${authEndpoint}/${id_cd}/categorias-armazenagem`, payload);
    return response;
}
