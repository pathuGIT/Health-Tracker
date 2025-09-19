// src/components/Charts/BMIChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { date: "2025-01", bmi: 24 },
    { date: "2025-02", bmi: 23.5 },
    { date: "2025-03", bmi: 23.2 },
    { date: "2025-04", bmi: 22.9 },
    { date: "2025-05", bmi: 22.5 },
];

const BMIChart = () => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[20, 30]} />
                <Tooltip />
                <Line type="monotone" dataKey="bmi" stroke="#4f46e5" strokeWidth={3} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default BMIChart;
