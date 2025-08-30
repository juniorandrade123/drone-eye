import { Api } from "../../config";
import { buscaEmpresaId, buscaUsuarioId } from "../../config/auth";

const authEndpoint = `relatorio-final`;

export async function getRelatorioFinal(data_inicio, data_fim) {
    const empresaId = buscaEmpresaId();
    const params = new URLSearchParams();

    if (data_inicio) params.append('data_inicio', data_inicio);
    if (data_fim) params.append('data_fim', data_fim);

    const response = await Api.get(`${authEndpoint}/${empresaId}?${params.toString()}`);
    return response;
}

export async function getRelatorioXml(id_cd, data_inicio, data_fim, codigo_rua) {
    const empresaId = buscaEmpresaId();
    const usuarioId = buscaUsuarioId();
    const params = new URLSearchParams();

    if (id_cd) params.append('id_cd', id_cd);
    if (usuarioId) params.append('id_usuario', usuarioId);
    if (empresaId) params.append('id_empresa', empresaId);
    if (data_inicio) params.append('data_inicio', data_inicio);
    if (data_fim) params.append('data_fim', data_fim);
    if (codigo_rua) params.append('codigo_rua', codigo_rua);

    const response = await Api.get(`${authEndpoint}/xml?${params.toString()}`);
    return response;
}
