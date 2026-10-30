import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import DropDown from "../../components/DropDown/DropDown";
import { useAuth } from "../../context/AuthContext";
import {
    createAlert,
    deleteAlert,
    getAlerts
} from "../../services/alertService";

import "./NotificationsPage.scss";

/**
 * Só estas moedas são coletadas de 5 em 5 minutos pelo backend. Um
 * alerta de outra moeda nunca seria disparado, então nem é oferecido.
 */
const ALERT_COINS = {
    "Dólar Americano": "USD",
    "Euro": "EUR",
    "Bitcoin": "BTC"
};

const COIN_NAMES = Object.keys(ALERT_COINS);

export default function NotificationsPage() {
    const { user, loading: loadingSession } = useAuth();
    const location = useLocation();

    const [coin, setCoin] = useState(COIN_NAMES[0]);
    const [value, setValue] = useState("");
    const [alerts, setAlerts] = useState([]);
    const [loadingAlerts, setLoadingAlerts] = useState(true);
    const [feedback, setFeedback] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadAlerts = useCallback(async (signal) => {
        try {
            const data = await getAlerts(signal);

            setAlerts(data);
        } catch (error) {
            if (signal?.aborted) return;

            setFeedback({
                type: "error",
                text: "Não foi possível carregar seus alertas."
            });
        } finally {
            if (!signal?.aborted) {
                setLoadingAlerts(false);
            }
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        const controller = new AbortController();

        loadAlerts(controller.signal);

        return () => controller.abort();
    }, [user, loadAlerts]);

    async function handleSubmit(event) {
        event.preventDefault();

        setFeedback(null);

        const target = Number(value);

        if (!target || target <= 0) {
            setFeedback({
                type: "error",
                text: "Informe um valor maior que zero."
            });
            return;
        }

        setSubmitting(true);

        try {
            await createAlert(ALERT_COINS[coin], target);

            setValue("");

            setFeedback({
                type: "success",
                text: `Alerta criado para ${coin} em R$ ${target.toFixed(2)}.`
            });

            await loadAlerts();
        } catch (error) {
            setFeedback({
                type: "error",
                text: "Não foi possível criar o alerta."
            });
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(alertId) {
        setFeedback(null);

        try {
            await deleteAlert(alertId);

            setAlerts((previous) =>
                previous.filter((item) => item.id !== alertId)
            );
        } catch (error) {
            setFeedback({
                type: "error",
                text: "Não foi possível excluir o alerta."
            });
        }
    }

    // Espera a sessão ser verificada antes de decidir: sem isso a tela
    // de login piscaria para quem já está autenticado.
    if (loadingSession) {
        return <p className="notifications__status">Carregando...</p>;
    }

    // O login só é exigido aqui — o resto da aplicação é livre.
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return (
        <main className="notifications">
            <section className="notifications__card">
                <header className="notifications__header">
                    <img src="src/assets/target.png" alt="" />
                    <p>Crie seus Alertas</p>
                </header>

                <form
                    className="notifications__form"
                    onSubmit={handleSubmit}
                >
                    <div className="notifications__field">
                        <label className="notifications__label">
                            Escolha a Moeda
                        </label>

                        <DropDown
                            coins={COIN_NAMES}
                            selected={coin}
                            handler={setCoin}
                            width="100%"
                        />
                    </div>

                    <div className="notifications__field">
                        <label
                            className="notifications__label"
                            htmlFor="target-value"
                        >
                            Valor a notificar
                        </label>

                        <div className="notifications__value">
                            <span>R$</span>

                            <input
                                id="target-value"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0,00"
                                value={value}
                                onChange={(event) =>
                                    setValue(event.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <button
                        className="notifications__submit"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? "Criando..." : "Criar alerta"}
                    </button>
                </form>

                {feedback && (
                    <p
                        className={`notifications__feedback notifications__feedback--${feedback.type}`}
                    >
                        {feedback.text}
                    </p>
                )}
            </section>

            <section className="notifications__card">
                <header className="notifications__header">
                    <img src="src/assets/money.png" alt="" />
                    <p>Seus Alertas</p>
                </header>

                {loadingAlerts ? (
                    <p className="notifications__status">
                        Carregando alertas...
                    </p>
                ) : alerts.length === 0 ? (
                    <p className="notifications__status">
                        Você ainda não tem alertas. Crie o primeiro acima.
                    </p>
                ) : (
                    <table className="notifications__table">
                        <thead>
                            <tr>
                                <th>Moeda</th>
                                <th>Valor</th>
                                <th>Situação</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {alerts.map((alert) => (
                                <tr key={alert.id}>
                                    <td>{alert.coin_name}</td>

                                    <td>
                                        R${" "}
                                        {Number(
                                            alert.target_value_expected
                                        ).toFixed(2)}
                                    </td>

                                    <td>
                                        {alert.notified_at
                                            ? "Avisado"
                                            : "Aguardando"}
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            className="notifications__delete"
                                            onClick={() =>
                                                handleDelete(alert.id)
                                            }
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </main>
    );
}
