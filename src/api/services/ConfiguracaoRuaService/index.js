import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const authEndpoint = "ruas/config";

export async function listarRuas(id_cd, incluir_inativas) {
  const params = new URLSearchParams();
  const empresaId = buscaEmpresaId();

  if (incluir_inativas) params.append("incluir_inativas", incluir_inativas);

  const response = await Api.get(
    `/empresas/${empresaId}/cds/${id_cd}/${authEndpoint}?${params.toString()}`
  );

  return response;
}

export async function createRua(payload) {
  const empresaId = buscaEmpresaId();
  
  const response = await Api.post(
    `/empresas/${empresaId}/cds/${payload.id_cd}/${authEndpoint}`,
    payload
  );

  return response;
}

export async function deleteRua(id, id_cd) {
  const empresaId = buscaEmpresaId();

  const response = await Api.remove(
    `/empresas/${empresaId}/cds/${id_cd}/${authEndpoint}/${id}`
  );
  return response;
}
