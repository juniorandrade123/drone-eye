import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const authEndpoint = "ruas/config";

export async function listarRuas(id_cd, incluir_inativas) {
  const params = new URLSearchParams();
  const empresaId = buscaEmpresaId();

  if (empresaId) params.append("id_empresa", empresaId);
  if (id_cd) params.append("id_cd", id_cd);
  if (typeof incluir_inativas === "boolean")
    params.append("incluir_inativas", incluir_inativas);

  const response = await Api.get(`${authEndpoint}?${params.toString()}`);
  return response;
}

export async function createRua(payload) {
  payload.id_empresa = buscaEmpresaId();
  const response = await Api.post(authEndpoint, payload);
  return response;
}

export async function deleteRua(id, id_cd) {
    const params = new URLSearchParams();
    params.append("id_empresa", buscaEmpresaId());
    params.append("id_cd", id_cd);

    const response = await Api.remove(`${authEndpoint}/${id}?${params.toString()}`);
    return response;
}
