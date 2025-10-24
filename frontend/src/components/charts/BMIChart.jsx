// src/components/Charts/BMIChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// The component now accepts data as a prop
const BMIChart = ({ data }) => {
    // If no data, render an empty chart container or a message
    if (!data || data.length === 0) {
        return <p className="text-center text-text-muted">No BMI data available.</p>;
    }
    
    // Convert date string/object to a more readable format for the XAxis tick
    const formatXAxis = (tickItem) => {
        if (!tickItem) return '';
        // Assuming date is in 'YYYY-MM-DD' or similar format
        const date = new Date(tickItem);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // Determine the domain for Y-axis (BMI: usually dynamically or within a safe range)
    const allBmis = data.map(d => d.bmi);
    const minBmi = Math.floor(Math.min(...allBmis, 20) / 5) * 5; 
    const maxBmi = Math.ceil(Math.max(...allBmis, 30) / 5) * 5; 

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                    dataKey="date" 
                    tickFormatter={formatXAxis} 
                    stroke="#6B7280" 
                    tickLine={false} 
                    axisLine={false} 
                />
                <YAxis 
                    domain={[minBmi, maxBmi]} 
                    stroke="#6B7280" 
                    tickLine={false} 
                    axisLine={false} 
                />
                <Tooltip 
                    labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                    formatter={(value, name) => [`${value}`, 'BMI']}
                />
                <Line 
                    type="monotone" 
                    dataKey="bmi" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default BMIChart;