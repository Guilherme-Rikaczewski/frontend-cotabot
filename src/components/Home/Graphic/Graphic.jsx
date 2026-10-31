
import "./Graphic.scss";
import ApexChart from "./LineGraph/ApexChart";
import DropDown from "../../DropDown/DropDown";

const startDate = new Date(2016, 0, 1);
const currentDate = new Date();

const maxDays = Math.ceil(
    (currentDate - startDate) / (1000 * 60 * 60 * 24)
);

const periodTable = {
    "1 Day": 1,
    "1 Week": 7,
    "1 Month": 31,
    "1 Year": 365,
    "Max": maxDays,
};

export default function Graphic({
    quotePeriodList,
    selectedPeriod,
    handlerPeriod
}) {
    const exibitionList = Object.keys(periodTable);

    function handlePeriodChange(period) {
        const days = periodTable[period];

        if (days) {
            handlerPeriod(period, days);
        }
    }

    return (
        <section className="graphic">
            <header>
                <img
                    src="src/assets/graphic.png"
                    alt="money icon"
                />

                <p>Análise</p>

                <DropDown
                    coins={exibitionList}
                    selected={selectedPeriod}
                    handler={handlePeriodChange}
                    variant="code"
                    width="150px"
                    className="lista"
                />
            </header>

            <div className="graphs">
                <ApexChart graphData={quotePeriodList} />
            </div>
        </section>
    );
}
