import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const authEndpoint = `r2`;

export async function gerarLinkImagem(payload) {
    const empresaId = buscaEmpresaId();
    
    payload.id_empresa = empresaId;
    

    const response = await Api.post(`${authEndpoint}/urls`, payload);
    return response;
}