import "./Graphic.scss";
import ApexChart from "./LineGraph/ApexChart";
import DropDown from "../../DropDown/DropDown";


export default function Graphic({ quotePeriodList }) {

    const periodTable = {
        '1 Day': 1,
        '1 Week': 7,
        '1 Month': 31,
        '1 Year': 365,
        'Max': 9999999,
    }

    const exibitionList = Object.keys(periodTable)
    const daysNumberList = Object.values(periodTable)

    return (
        <section className="graphic">
            <header>
                <img src="src/assets/graphic.png" alt="money icon" />
                <p>Análise</p>

                <DropDown
                    coins={exibitionList}
                    selected={"1 Month"}
                    // handler={handleOriginChange}
                    variant="code"
                    width="100px"
                />
            </header>
            <div className="graphs">
                <ApexChart
                    graphData={quotePeriodList}
                />
            </div>
        </section>
    );
}