
import "./QuoteCalculator.scss";
import DropDown from "../../DropDown/DropDown";
import { useState, useEffect } from "react";
import { coinsCodes, coinsMask } from "../../../services/coinsList";
import calculatorIcon from "../../../assets/calculator.png"

export default function QuoteCalculator({
    quote,
    origin,
    target,
    handlerOrigin,
    handlerTarget
}) {
    const [firstInput, setFirstInput] = useState("1");
    const [secondInput, setSecondInput] = useState("");
    const [lastEdited, setLastEdited] = useState("first");

    const validQuote = Number(quote);

    const hasValidQuote =
        quote !== null &&
        quote !== undefined &&
        quote !== "" &&
        Number.isFinite(validQuote) &&
        validQuote > 0;

    function getCoinName(code) {
        return Object.keys(coinsMask).find(
            (name) => coinsMask[name] === code
        );
    }

    function handleOriginChange(code) {
        const name = getCoinName(code);

        if (name) {
            handlerOrigin(name);
        }
    }

    function handleTargetChange(code) {
        const name = getCoinName(code);

        if (name) {
            handlerTarget(name);
        }
    }

    useEffect(() => {
        if (!hasValidQuote) {
            setSecondInput("");
            return;
        }

        if (lastEdited === "first") {
            setSecondInput(
                firstInput === ""
                    ? ""
                    : String(Number(firstInput) * validQuote)
            );
        } else {
            setFirstInput(
                secondInput === ""
                    ? ""
                    : String(Number(secondInput) / validQuote)
            );
        }
    }, [quote]);

    function handleFirstInput(event) {
        const value = event.target.value;

        setFirstInput(value);
        setLastEdited("first");

        if (value === "" || !hasValidQuote) {
            setSecondInput("");
            return;
        }

        setSecondInput(String(Number(value) * validQuote));
    }

    function handleSecondInput(event) {
        const value = event.target.value;

        setSecondInput(value);
        setLastEdited("second");

        if (value === "" || !hasValidQuote) {
            setFirstInput("");
            return;
        }

        setFirstInput(String(Number(value) / validQuote));
    }

    return (
        <section className="quote-calculator">
            <header>
                <img
                    src={calculatorIcon}
                    alt="Ícone de calculadora"
                />
                <p>Calcular valores</p>
            </header>

            <div className="calculator-area">
                <div className="input-area">
                    <input
                        type="number"
                        name="origin-value"
                        id="origin-value"
                        value={firstInput}
                        onChange={handleFirstInput}
                        step="any"
                    />

                    <input
                        type="number"
                        name="target-value"
                        id="target-value"
                        value={secondInput}
                        onChange={handleSecondInput}
                        step="any"
                    />
                </div>

                <div className="dropdown-area">
                    <DropDown
                        coins={coinsCodes}
                        selected={coinsMask[origin]}
                        handler={handleOriginChange}
                        variant="code"
                        width="150px"
                    />

                    <DropDown
                        coins={coinsCodes}
                        selected={coinsMask[target]}
                        handler={handleTargetChange}
                        variant="code"
                        width="150px"
                    />
                </div>
            </div>
        </section>
    );
}
