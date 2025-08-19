import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const authEndpoint = "cd";

export async function getCD(id_cd) {
  const empresaId = buscaEmpresaId();
  const params = new URLSearchParams();
  
  if (id_cd) params.append("id_cd", id_cd);
  if (empresaId) params.append("id_empresa", empresaId);

  const response = await Api.get(`${authEndpoint}?${params.toString()}`);
  return response;
}

export async function createCD(payload) {
  const response = await Api.post(authEndpoint, payload);
  return response;
}

export async function editCD(id, payload) {
  const response = await Api.put(authEndpoint + id, payload);
  return response;
}

export async function deleteCD(id) {
  const response = await Api.remove(authEndpoint + id);
  return response;
}
