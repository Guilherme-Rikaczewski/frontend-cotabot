import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import { getAlerts } from "../../../services/alertService";
import "./TargetValues.scss";
import targetIcon from "../../../assets/target.png"


export default function TargetValues() {
    const { user, loading: loadingSession } = useAuth();

    const [alerts, setAlerts] = useState([]);
    const [loadingAlerts, setLoadingAlerts] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        // Sem sessão não há alertas para buscar: o card vira um convite.
        if (!user) {
            setAlerts([]);
            return;
        }

        const controller = new AbortController();

        async function loadAlerts() {
            setLoadingAlerts(true);
            setFailed(false);

            try {
                const data = await getAlerts(controller.signal);

                setAlerts(data);
            } catch {
                if (controller.signal.aborted) return;

                setFailed(true);
            } finally {
                if (!controller.signal.aborted) {
                    setLoadingAlerts(false);
                }
            }
        }

        loadAlerts();

        return () => controller.abort();
    }, [user]);

    function renderContent() {
        if (loadingSession || loadingAlerts) {
            return <p className="target-values__status">Carregando...</p>;
        }

        if (!user) {
            return (
                <p className="target-values__status">
                    <Link to="/login">Entre na sua conta</Link> para
                    acompanhar seus valores alvo.
                </p>
            );
        }

        if (failed) {
            return (
                <p className="target-values__status">
                    Não foi possível carregar seus alertas.
                </p>
            );
        }

        if (alerts.length === 0) {
            return (
                <p className="target-values__status">
                    Nenhum valor alvo ainda.{" "}
                    <Link to="/notificacoes">Crie o primeiro</Link>.
                </p>
            );
        }

        return (
            <ul className="target-values__list">
                {alerts.map((alert) => (
                    <li className="target-values__item" key={alert.id}>
                        <span className="target-values__coin">
                            {/* O backend grava o par inteiro ("USD-BRL"). */}
                            {alert.coin_name.split("-")[0]}
                        </span>

                        <span className="target-values__value">
                            R${" "}
                            {Number(alert.target_value_expected).toFixed(2)}
                        </span>

                        <span
                            className={`target-values__badge ${
                                alert.notified_at
                                    ? "target-values__badge--done"
                                    : ""
                            }`}
                        >
                            {alert.notified_at ? "Avisado" : "Aguardando"}
                        </span>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <section className="target-values">
            <header>
                <img src={targetIcon} alt="money icon" />
                <p>Valores alvo</p>

                <Link
                    to="/notificacoes"
                    className="target-values__edit"
                    aria-label="Gerenciar valores alvo"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.1741 6.81201C21.7028 6.28344 21.9998 5.56648 21.9999 4.81887C22 4.07125 21.7031 3.35422 21.1746 2.82551C20.646 2.29681 19.929 1.99973 19.1814 1.99963C18.4338 1.99954 17.7168 2.29644 17.1881 2.82501L3.84206 16.174C3.60988 16.4055 3.43817 16.6905 3.34206 17.004L2.02106 21.356C1.99521 21.4425 1.99326 21.5344 2.01541 21.6219C2.03756 21.7094 2.08298 21.7892 2.14685 21.853C2.21073 21.9168 2.29068 21.9621 2.37821 21.9841C2.46575 22.0061 2.55762 22.004 2.64406 21.978L6.99706 20.658C7.31023 20.5628 7.59523 20.3921 7.82706 20.161L21.1741 6.81201Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Link>
            </header>

            {renderContent()}
        </section>
    );
}
