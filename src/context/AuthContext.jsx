import { createContext, useContext, useEffect, useState } from "react";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Começa carregando: só o backend sabe se o cookie httpOnly ainda
  // vale, e sem esperar a resposta a interface piscaria a tela de login
  // para quem já está autenticado.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSession() {
      try {
        const currentUser = await getCurrentUser(controller.signal);

        setUser(currentUser);
      } catch {
        // 401 é o caso normal de quem não fez login.
        setUser(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadSession();

    return () => controller.abort();
  }, []);

  async function login(email, password) {
    await loginRequest(email, password);

    const currentUser = await getCurrentUser();

    setUser(currentUser);

    return currentUser;
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      // Mesmo que o backend falhe, a sessão local cai: o usuário pediu
      // para sair.
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa estar dentro de um AuthProvider");
  }

  return context;
}
