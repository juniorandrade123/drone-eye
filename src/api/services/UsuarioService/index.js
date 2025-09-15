import { Api } from "../../config";
import { buscaEmpresaId } from "../../config/auth";

const authEndpoint = "usuario/";

export async function getUsers(id_empresa, incluirInativos) {
  const response = await Api.get(
    authEndpoint +
      `?id_empresa=${id_empresa}&incluir_inativos=${incluirInativos}`
  );

  return response;
}

export async function getUsersPaginado(
  id_empresa,
  incluir_inativos,
  nome_email,
  pagina,
  limite
) {
  const params = new URLSearchParams();

  if (id_empresa) params.append("id_empresa", id_empresa);
  if (typeof incluir_inativos === "boolean")  params.append("incluir_inativos", incluir_inativos);
  if (nome_email) params.append("q", nome_email);

  if (pagina) params.append("pagina", pagina);
  else params.append("pagina", 1);

  if (limite) params.append("limite", limite);
  else params.append("limite", 1000);

  const response = await Api.get(authEndpoint + `?${params.toString()}`);

  return response;
}

export async function createUser(payload) {
  const response = await Api.post(authEndpoint, payload);
  return response;
}

export async function editUser(id, payload) {
  const response = await Api.put(authEndpoint + id, payload);
  return response;
}

export async function toggleStatusUser(id, payload) {
  const response = await Api.patch(authEndpoint + `${id}/status`, payload);
  return response;
}
