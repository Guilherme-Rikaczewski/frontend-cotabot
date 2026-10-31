import axios from "axios";

// const apiBaseUrl = "http://localhost:8000/";
const apiBaseUrl = "/api";

/** Sem timeout, uma API travada deixaria a interface carregando para sempre. */
export const REQUEST_TIMEOUT_MS = 10_000_000;

const api = axios.create({
  baseURL: apiBaseUrl,
  // A sessão vive num cookie httpOnly emitido pelo /auth/login/;
  // sem isto o navegador não o envia nas requisições autenticadas.
  withCredentials: true,
  timeout: REQUEST_TIMEOUT_MS,
});

/** Rotas que não devem disparar renovação: são elas que a produzem. */
const AUTH_ROUTES = ["/auth/refresh/", "/auth/login/", "/auth/logout/"];

/**
 * Renovação em andamento. Várias telas pedem dados ao mesmo tempo; sem
 * compartilhar a promessa, cada 401 chamaria o /auth/refresh/ por conta
 * própria e os refresh tokens se invalidariam entre si.
 */
let refreshing = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    const isAuthRoute = AUTH_ROUTES.some((route) =>
      original?.url?.includes(route)
    );

    // Só vale renovar uma vez por requisição: se o 401 persistir depois
    // do refresh, a sessão acabou de verdade.
    if (status !== 401 || !original || original._retry || isAuthRoute) {
      throw error;
    }

    original._retry = true;

    try {
      refreshing = refreshing ?? api.post("/auth/refresh/");

      await refreshing;
    } catch {
      // Refresh token ausente ou expirado: devolve o 401 original para
      // a tela decidir (normalmente, mandar para o login).
      throw error;
    } finally {
      refreshing = null;
    }

    return api(original);
  }
);

export default api;
