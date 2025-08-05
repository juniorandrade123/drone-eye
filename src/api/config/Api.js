import axios from 'axios';

const headers = { headers: { 'Content-Type': 'application/json' } };

var baseURL = import.meta.env.VITE_API_URL

const validateStatus = (status) => status < 400;

const apiInstance = axios.create({
  baseURL,
  headers,
  validateStatus
});

export const get = async (endpoint, params) => {
  try {
    const response = await apiInstance.get(endpoint, { params });
    const responseHeaders = response.headers;

    return Handlesuccess(response.data, responseHeaders);
  } catch (error) {
    return handleError(error);
  }
};

export const post = async (endpoint, payload) => {
  try {
    const response = await apiInstance.post(endpoint, payload);
    const responseHeaders = response.headers;

    return Handlesuccess(response.data, responseHeaders);
  } catch (error) {
    return handleError(error);
  }
};

export const put = async (endpoint, payload) => {
  try {
    const response = await apiInstance.put(endpoint, payload);
    const responseHeaders = response.headers;

    return Handlesuccess(response.data, responseHeaders);
  } catch (error) {
    return handleError(error);
  }
};

export const remove = async (endpoint) => {
  try {
    const response = await apiInstance.delete(endpoint);
    const responseHeaders = response.headers;

    return Handlesuccess(response.data, responseHeaders);
  } catch (error) {
    return handleError(error);
  }
};

export const deleteWithPayload = async (endpoint, payload) => {
  try {
    const response = await apiInstance.post(endpoint, payload);
    const responseHeaders = response.headers;

    return Handlesuccess(response.data, responseHeaders);
  } catch (error) {
    return handleError(error);
  }
};

export const getExternal = async (endpoint) => {
  try {
    const response = await axios.get(endpoint);

    const obj = {
      ok: true,
      data: response.data
    };
    return obj;

  } catch (error) {
    return handleError(error);
  }
};

function handleError(error) {
  if (error.response) {

    if (error.response.status === 401)
    {
      removeAuthorization();
      return; 
    }

    if (typeof error.response.data === 'string')
      return Handlefailure(error.response.data);

    return Handlefailure('Erro não tratado');

  } if (error.request) {
    return Handlefailure('Nenhuma resposta foi obtida - api fora do ar.');
  }
  return Handlefailure(error.message);
}

export function grantAuthorization(token) {
  apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function removeAuthorization() {
  delete apiInstance.defaults.headers.common.Authorization;
  apiInstance.defaults.headers.common['Authorization'] = ''
}

function Handlesuccess(response, responseHeaders) {
  const obj = {
    ok: true,
    data: response,
    responseHeaders,
    error: undefined
  };

  return obj;
}

function Handlefailure(errorMessage) {
  const obj = {
    ok: false,
    data: undefined,
    responseHeaders: undefined,
    error: {
      message: errorMessage
    }
  };

  return obj;
}