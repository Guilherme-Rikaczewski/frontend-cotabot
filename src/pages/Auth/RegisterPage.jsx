import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "./AuthPage.scss";

/** Espelha as regras do backend (src/schemas/user_schema.py). */
function validatePassword(password) {
    if (password.length < 8) {
        return "A senha precisa ter ao menos 8 caracteres.";
    }

    if (!/[a-z]/.test(password)) {
        return "A senha precisa ter uma letra minúscula.";
    }

    if (!/[A-Z]/.test(password)) {
        return "A senha precisa ter uma letra maiúscula.";
    }

    if (!/[0-9]/.test(password)) {
        return "A senha precisa ter um número.";
    }

    return "";
}

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (password !== confirmation) {
            setError("As senhas não coincidem.");
            return;
        }

        const passwordError = validatePassword(password);

        if (passwordError) {
            setError(passwordError);
            return;
        }

        setSubmitting(true);

        try {
            await register(email, username, password);

            // Já entra na sessão: o usuário acabou de informar as
            // credenciais, pedir login de novo seria atrito à toa.
            await login(email, password);

            navigate("/notificacoes", { replace: true });
        } catch (requestError) {
            const status = requestError?.response?.status;

            setError(
                status === 500
                    ? "Não foi possível cadastrar. O e-mail já pode estar em uso."
                    : "Não foi possível cadastrar. Verifique os dados."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="auth">
            <form
                className="auth__card auth__card--wide"
                onSubmit={handleSubmit}
            >
                <Link className="auth__back" to="/">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#3C3C40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Voltar para a Home
                </Link>

                <h1 className="auth__title">CADASTRO</h1>

                <div className="auth__fields auth__fields--two">
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
                        <label className="auth__label" htmlFor="username">
                            Nome
                        </label>

                        <input
                            id="username"
                            className="auth__input"
                            type="text"
                            placeholder="Ex: João da Silva"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            // A coluna no banco é String(20); acima disso
                            // o cadastro falharia no servidor.
                            maxLength={20}
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
                            placeholder="Mín. 8, com maiúscula e número"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="auth__field">
                        <label className="auth__label" htmlFor="confirmation">
                            Confirme a senha
                        </label>

                        <input
                            id="confirmation"
                            className="auth__input"
                            type="password"
                            placeholder="Digite a senha novamente"
                            value={confirmation}
                            onChange={(event) =>
                                setConfirmation(event.target.value)
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
                    {submitting ? "Cadastrando..." : "Cadastrar"}
                </button>

                <p className="auth__divider">ou</p>

                <Link className="auth__switch" to="/login">
                    Login
                </Link>
            </form>
        </div>
    );
}
