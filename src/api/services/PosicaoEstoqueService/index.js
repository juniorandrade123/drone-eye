import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const authEndpoint = `posicao-estoque`;

export async function getPosicoes(id_empresa, codigo_rua, ativo) {
  const params = new URLSearchParams();

  if (id_empresa) params.append("id_empresa", id_empresa);
  if (codigo_rua) params.append("codigo_rua", codigo_rua);
  if (typeof ativo === "boolean") params.append("ativo", ativo);

  const response = await Api.get(
    `${authEndpoint}/?${params.toString()}&limit=5000&offset=0`
  );
  return response;
}

export async function getPosicaoById(id_posicao, id_cd) {
  const empresaId = buscaEmpresaId();
  const params = new URLSearchParams();

  if (empresaId) params.append("id_empresa", empresaId);
  if (id_cd) params.append("id_cd", id_cd);

  const response = await Api.get(
    `${authEndpoint}/${id_posicao}?${params.toString()}`
  );
  return response;
}

export async function getRuasComPosicao(id_cd) {
  const empresaId = buscaEmpresaId();
  const params = new URLSearchParams();

  if (empresaId) params.append("id_empresa", empresaId);
  if (id_cd) params.append("id_cd", id_cd);

  const response = await Api.get(`${authEndpoint}/ruas?${params.toString()}`);
  return response;
}

export async function createPosicao(payload) {
  const response = await Api.post(`${authEndpoint}/`, payload);
  return response;
}

export async function updatePosicao(payload, id_posicao, id_cd) {

  if (payload.id_empresa) params.append("id_empresa", payload.id_empresa);
  if (id_cd) params.append("id_cd", id_cd);

  const response = await Api.put(
    `${authEndpoint}/${id_posicao}?${params.toString()}`,
    payload
  );
  return response;
}

export async function deletePosicao(id_posicao, id_cd, id_empresa) {
  const params = new URLSearchParams();

  if (id_empresa) params.append("id_empresa", id_empresa);
  if (id_cd) params.append("id_cd", id_cd);

  const response = await Api.remove(
    `${authEndpoint}/${id_posicao}?${params.toString()}`
  );
  return response;
}
