import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const authEndpoint = 'dashboard';

export async function getCards() {
    const empresaId = buscaEmpresaId();
    const response = await Api.get(authEndpoint + `/cards?id_empresa=${empresaId}`);

    return response;
}
export async function getCdsStatus() {
    const empresaId = buscaEmpresaId();
    const response = await Api.get(authEndpoint + `/cds-status?id_empresa=${empresaId}`);

    return response;
}
export async function getUltimosInventarios(limiteLinha) {
    const empresaId = buscaEmpresaId();
    const response = await Api.get(authEndpoint + `/ultimos-inventarios?id_empresa=${empresaId}&limit=${limiteLinha}`);

    return response;
}
export async function getAlerts() {
    const empresaId = buscaEmpresaId();
    const response = await Api.get(authEndpoint + `/alerts?id_empresa=${empresaId}`);

    return response;
}



