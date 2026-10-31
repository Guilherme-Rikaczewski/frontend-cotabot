
import "./HomePage.scss";
import { useState, useEffect } from "react";

import CurrentQuote from "../../components/Home/CurrentQuote/CurrentQuote";
import QuoteCalculator from "../../components/Home/QuoteCalculator/QuoteCalculator";
import TargetValues from "../../components/Home/TargetValues/TargetValues";
import Graphic from "../../components/Home/Graphic/Graphic";

import {
    getQuoteRegistered,
    getQuoteRealTime,
    getQuoteOnPeriod
} from "../../services/quoteService";

import { coinsMask } from "../../services/coinsList";

export default function HomePage() {
    const [quote, setQuote] = useState(null);
    const [quoteList, setQuoteList] = useState(null);

    const [origin, setOrigin] = useState("Dólar Americano");
    const [target, setTarget] = useState("Real Brasileiro");

    const [selectedPeriod, setSelectedPeriod] = useState("1 Month");
    const [selectedDays, setSelectedDays] = useState(31);

    const localOrigins = ["USD", "EUR", "BTC"];
    const localTargets = ["BRL"];

    // Atualiza o período selecionado.
    function handlePeriodChange(label, days) {
        setSelectedPeriod(label);
        setSelectedDays(days);
    }

    // Busca a cotação atual.
    useEffect(() => {
        const controller = new AbortController();

        async function loadCurrentQuote() {
            const normalizedOrigin = coinsMask[origin];
            const normalizedTarget = coinsMask[target];

            if (!normalizedOrigin || !normalizedTarget) {
                setQuote(null);
                return;
            }

            if (normalizedOrigin === normalizedTarget) {
                setQuote(1);
                return;
            }

            const useRegistered =
                localOrigins.includes(normalizedOrigin) &&
                localTargets.includes(normalizedTarget);

            const getFunction = useRegistered
                ? getQuoteRegistered
                : getQuoteRealTime;

            try {
                const currentResult = await getFunction(
                    normalizedOrigin,
                    normalizedTarget,
                    controller.signal
                );

                if (controller.signal.aborted) return;

                setQuote(currentResult?.conversion ?? null);

            } catch (error) {
                if (controller.signal.aborted) return;

                console.error("Erro ao buscar cotação:", error);
                setQuote(null);
            }
        }

        loadCurrentQuote();

        return () => controller.abort();

    }, [origin, target]);

    // Busca o histórico de acordo com o período selecionado.
    useEffect(() => {
        const controller = new AbortController();

        async function loadPeriodQuotes() {
            const normalizedOrigin = coinsMask[origin];
            const normalizedTarget = coinsMask[target];

            if (!normalizedOrigin || !normalizedTarget) {
                setQuoteList(null);
                return;
            }

            if (normalizedOrigin === normalizedTarget) {
                setQuoteList([]);
                return;
            }

            // Um dia: dados por hora.
            // Demais períodos: dados por dia.
            const interval =
                selectedDays === 1 ? "hour" : "day";

            try {
                const periodResult = await getQuoteOnPeriod(
                    normalizedOrigin,
                    normalizedTarget,
                    selectedDays,
                    interval,
                    controller.signal
                );

                if (controller.signal.aborted) return;

                setQuoteList(periodResult);

            } catch (error) {
                if (controller.signal.aborted) return;

                console.error("Erro ao buscar histórico:", error);
                setQuoteList(null);
            }
        }

        loadPeriodQuotes();

        return () => controller.abort();

    }, [origin, target, selectedDays]);

    return (
        <main>
            <p className="top-txt">
                Quem é vivo sempre aparece...
            </p>

            <div className="top-box">
                <CurrentQuote
                    origin={origin}
                    target={target}
                    quote={quote}
                    handlerOrigin={setOrigin}
                    handlerTarget={setTarget}
                />

                <QuoteCalculator
                    quote={quote}
                    origin={origin}
                    target={target}
                    handlerOrigin={setOrigin}
                    handlerTarget={setTarget}
                />
            </div>

            <div className="bottom-box">
                <TargetValues />

                <Graphic
                    quotePeriodList={quoteList}
                    selectedPeriod={selectedPeriod}
                    handlerPeriod={handlePeriodChange}
                />
            </div>
        </main>
    );
}
