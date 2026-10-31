
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import "./ApexChart.scss";

const ApexChart = ({ graphData }) => {

    const dates = useMemo(() => {
        return (graphData?.conversions ?? []).map((item) => [
            new Date(item.created_at).getTime(),
            Number(item.conversion_value),
        ]);
    }, [graphData]);

    const series = useMemo(() => [
        {
            name: "Cotação",
            data: dates,
        },
    ], [dates]);

    const options = {
        chart: {
            type: "area",
            height: 350,
            animations: {
                enabled: true,
            },
            zoom: {
                type: "x",
                enabled: true,
                autoScaleYaxis: true,
            },
            toolbar: {
                autoSelected: "zoom",
                offsetX: -180,
                offsetY: -10,
            },
        },

        dataLabels: {
            enabled: false,
        },

        markers: {
            size: dates.length > 100 ? 0 : 4,
        },

        title: {
            align: "left",
        },

        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100],
            },
        },

        yaxis: {
            labels: {
                formatter: (val) => val.toFixed(4),
            },
        },

        xaxis: {
            type: "datetime",
            labels: {
                datetimeUTC: false,
            },
        },

        tooltip: {
            shared: false,
            x: {
                format: "dd/MM/yyyy HH:mm",
            },
            y: {
                formatter: (val) => val.toFixed(4),
            },
        },

        noData: {
            text: "Nenhum histórico disponível",
            align: "center",
            verticalAlign: "middle",
        },
    };

    return (
        <div id="chart">
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height="100%"
            />
        </div>
    );
};

export default ApexChart;
