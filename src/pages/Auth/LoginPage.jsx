import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import "./AuthPage.scss";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Volta para onde o usuário tentou ir antes de cair no login.
    const destination = location.state?.from ?? "/notificacoes";

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            await login(email, password);

            navigate(destination, { replace: true });
        } catch (requestError) {
            const status = requestError?.response?.status;

            setError(
                status === 401
                    ? "E-mail ou senha incorretos."
                    : "Não foi possível entrar. Tente novamente."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="auth">
            <form className="auth__card" onSubmit={handleSubmit}>
                <Link className="auth__back" to="/">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#3C3C40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Voltar para a Home
                </Link>

                <h1 className="auth__title">LOGIN</h1>

                <div className="auth__fields">
                    <div className="auth__field">
                        <label className="auth__label" htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            className="auth__input"
                            type="email"
                            placeholder="Ex: cotabot@mail.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className="auth__field">
                        <label className="auth__label" htmlFor="password">
                            Senha
                        </label>

                        <input
                            id="password"
                            className="auth__input"
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />
                    </div>
                </div>

                {error && (
                    <p className="auth__feedback auth__feedback--error">
                        {error}
                    </p>
                )}

                <button
                    className="auth__submit"
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? "Entrando..." : "Entrar"}
                </button>

                <p className="auth__divider">ou</p>

                <Link className="auth__switch" to="/cadastro">
                    Realize o cadastro!
                </Link>
            </form>
        </div>
    );
}
