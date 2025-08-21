import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const authEndpoint = `empresas`;

export async function getArmazenagens(ativo) {
    const empresaId = buscaEmpresaId();
    const params = new URLSearchParams();
    
    if (typeof ativo === 'boolean') params.append('ativo', ativo);
    
    const response = await Api.get(`${authEndpoint}/${empresaId}/tipos-armazenagem?${params.toString()}`);
    return response;
}

export async function getArmazenagemById(id_armazenagem) {
    const empresaId = buscaEmpresaId();

    const response = await Api.get(`${authEndpoint}/${empresaId}/tipos-armazenagem/${id_armazenagem}`);
    return response;
}


export async function createArmazenagem(payload) {
    const empresaId = buscaEmpresaId();
    const response = await Api.post(`${authEndpoint}/${empresaId}/tipos-armazenagem`, payload);
    return response;
}
