import api from "./api";


/**
 * O backend usa OAuth2PasswordRequestForm no /auth/login/, que espera
 * form-urlencoded com os campos `username` e `password` — e o
 * `username` carrega o e-mail, porque é por ele que a conta é buscada.
 */
export const login = async (email, password, signal) => {
  try {
    const form = new URLSearchParams();

    form.append("username", email);
    form.append("password", password);

    const response = await api.post("/auth/login/", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const register = async (email, username, password, signal) => {
  try {
    const response = await api.post(
      "/users/",
      { email, username, password },
      { signal }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const logout = async (signal) => {
  try {
    const response = await api.post("/auth/logout/", null, { signal });

    return response.data;
  } catch (error) {
    throw error;
  }
};


/** Dados do usuário da sessão atual. Lança 401 se não houver sessão. */
export const getCurrentUser = async (signal) => {
  try {
    const response = await api.get("/users/", { signal });

    return response.data;
  } catch (error) {
    throw error;
  }
};
