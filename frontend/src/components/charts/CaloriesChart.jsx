// src/components/Charts/CaloriesChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
    { day: "Mon", consumed: 2200, burned: 1800 },
    { day: "Tue", consumed: 2000, burned: 1900 },
    { day: "Wed", consumed: 2500, burned: 2100 },
    { day: "Thu", consumed: 2300, burned: 2000 },
    { day: "Fri", consumed: 2400, burned: 2200 },
    { day: "Sat", consumed: 2600, burned: 2300 },
    { day: "Sun", consumed: 2000, burned: 1800 },
];

const CaloriesChart = () => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="consumed" fill="#f87171" />
                <Bar dataKey="burned" fill="#34d399" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CaloriesChart;
