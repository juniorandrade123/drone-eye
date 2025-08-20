import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const authEndpoint = `empresas`;

export async function getCategorias(id_cd, ativo) {
    const empresaId = buscaEmpresaId();
    const params = new URLSearchParams();
    
    if (typeof ativo === 'boolean') params.append('ativo', ativo);
    
    const response = await Api.get(`${authEndpoint}/${empresaId}/cds/${id_cd}/categorias-armazenagem?${params.toString()}`);
    return response;
}

export async function createCategoria(id_cd, payload) {
    const empresaId = buscaEmpresaId();
    const response = await Api.post(`${authEndpoint}/${empresaId}/cds/${id_cd}/categorias-armazenagem`, payload);
    return response;
}
