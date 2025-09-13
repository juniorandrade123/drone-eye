import { Api } from "../../config";

const authEndpoint = `empresas`;

export async function getArmazenagens(ativo, empresaId, codigo, nome) {
  const params = new URLSearchParams();

  if (typeof ativo === "boolean") params.append("ativo", ativo);
  if (codigo) params.append("codigo_like", codigo);
  if (nome) params.append("nome_like", nome);

  const response = await Api.get(
    `${authEndpoint}/${empresaId}/tipos-armazenagem?${params.toString()}`
  );
  return response;
}

export async function getArmazenagemById(id_armazenagem, empresaId) {
  const response = await Api.get(
    `${authEndpoint}/${empresaId}/tipos-armazenagem/${id_armazenagem}`
  );
  return response;
}

export async function createArmazenagem(payload) {
  const response = await Api.post(
    `${authEndpoint}/${payload.id_empresa}/tipos-armazenagem`,
    payload
  );
  return response;
}

export async function updateArmazenagem(payload) {
  const response = await Api.put(
    `${authEndpoint}/${payload.id_empresa}/tipos-armazenagem/${payload.id}`,
    payload
  );
  return response;
}

export async function deleteArmazenagem(id,empresaId) {
  const response = await Api.remove(
    `${authEndpoint}/${empresaId}/tipos-armazenagem/${id}`
  );
  return response;
}
