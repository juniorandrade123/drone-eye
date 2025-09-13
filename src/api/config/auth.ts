export const TOKEN_KEY = "@mac-hub-token";
export const USER_KEY = "@mac-hub-usuario";
export const isAuthenticated = () => sessionStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const login = (token: string, user: any) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, user);
};
export const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
};

export const buscaEmpresaId = () => {
    const userStr = sessionStorage.getItem(USER_KEY);
    if (!userStr) return '';
    const session = JSON.parse(userStr);
    return session.empresa.id;
}

export const buscaUsuarioId = () => {
    const userStr = sessionStorage.getItem(USER_KEY);
    if (!userStr) return '';
    const session = JSON.parse(userStr);
    return session.usuario.id;
}

export const buscaUsuarioNome = () => {
    const userStr = sessionStorage.getItem(USER_KEY);
    if (!userStr) return '';
    const session = JSON.parse(userStr);
    return session.usuario.nome;
}