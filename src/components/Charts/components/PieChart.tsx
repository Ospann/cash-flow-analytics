import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/reducer"; 
import ITransaction from "../../../store/interfaces/ITransaction";

const PieChart: React.FC = () => {
    const transactions = useSelector((state: RootState) => state.transactions);

    const expenseData = useMemo(() => {
        const expensesMap: { [key: string]: number } = {};

        transactions.forEach((transaction: ITransaction) => {
            const { category, sum } = transaction;
            if (expensesMap[category]) {
                expensesMap[category] += sum;
            } else {
                expensesMap[category] = sum;
            }
        });
        const pieData = Object.entries(expensesMap).map(([category, sum]) => ({
            name: category,
            y: sum,
        }));
        return pieData;
    }, [transactions]);

    const options = {
        chart: {
            type: "donut",
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
        labels: expenseData.map((data) => data.name),
    };

    return (
        <div id="chart">
            <ReactApexChart options={options} series={expenseData.map((data) => data.y)} type="donut" />
        </div>
    );
};

export default PieChart;
