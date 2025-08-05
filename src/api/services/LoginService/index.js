import { Api } from "../../config";

const authEndpoint = 'login';

export async function login(payload) {
  const response = await Api.post(authEndpoint, payload);

  return response;
}