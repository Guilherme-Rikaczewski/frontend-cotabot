import { useState, useRef, useEffect } from "react";
import "./DropDown.scss";

export default function DropDown({
    coins,
    type,
    variant = "name",
    width,
    handler,
    selected,
    className
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [internalCoin, setInternalCoin] = useState(
        type ?? coins[0]
    );
    const [search, setSearch] = useState("");
    const [openUpward, setOpenUpward] = useState(false);

    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    const selectedCoin = selected ?? internalCoin;

    useEffect(() => {
        if (!isOpen || !dropdownRef.current) return;

        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        // Abre para cima se não houver espaço suficiente embaixo
        setOpenUpward(
            spaceBelow < 320 && spaceAbove > spaceBelow
        );

        // Garante que o campo de busca receba o foco
        searchRef.current?.focus({ preventScroll: true });
    }, [isOpen]);

    function normalizeText(text) {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    const filteredCoins = coins.filter((coin) =>
        normalizeText(coin).includes(normalizeText(search))
    );

    function handleSelectCoin(coin) {
        if (selected === undefined) {
            setInternalCoin(coin);
        }

        handler?.(coin);
        setSearch("");
        setIsOpen(false);
    }

    function handleToggleDropdown() {
        setIsOpen((previous) => !previous);
        setSearch("");
    }

    return (
        <div
            ref={dropdownRef}
            className={`${className} coin-dropdown coin-dropdown--${variant} ${
                isOpen ? "open" : ""
            } ${openUpward ? "open-upward" : ""}`}
            style={
                width
                    ? { "--dropdown-width": width }
                    : undefined
            }
        >
            <button
                type="button"
                className="coin-selection"
                onClick={handleToggleDropdown}
                aria-expanded={isOpen}
                aria-label="Selecionar moeda"
            >
                <span>{selectedCoin}</span>
                <img src="src/assets/seta.png" alt="" />
            </button>

            <div className="coin-options">
                {isOpen && (
                    <input
                        ref={searchRef}
                        type="text"
                        className="coin-search"
                        placeholder="Buscar moeda..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        onClick={(event) => event.stopPropagation()}
                    />
                )}

                {isOpen && filteredCoins.length > 0 ? (
                    filteredCoins.map((coin) => (
                        <button
                            type="button"
                            key={coin}
                            className={`coin-option ${
                                selectedCoin === coin ? "selected" : ""
                            }`}
                            onClick={() => handleSelectCoin(coin)}
                        >
                            {coin}
                        </button>
                    ))
                ) : isOpen ? (
                    <p className="coin-no-results">
                        Nenhuma moeda encontrada.
                    </p>
                ) : null}
            </div>
        </div>
    );
}