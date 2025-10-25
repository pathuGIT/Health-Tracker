// src/components/Charts/CaloriesChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// The component now accepts data as a prop
// Data format expected: [{ date, consumed, burned }]
const CaloriesChart = ({ data }) => {
     if (!data || data.length === 0) {
        return <p className="text-center text-text-muted">No Calorie data available for this period.</p>;
    }
    
    // Convert date string/object to a readable format for the XAxis tick
    const formatXAxis = (tickItem) => {
        if (!tickItem) return '';
        const date = new Date(tickItem);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    // Sort data by date just in case
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));


    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                    dataKey="date" 
                    tickFormatter={formatXAxis} 
                    stroke="#6B7280" 
                    tickLine={false} 
                    axisLine={false} 
                />
                <YAxis 
                    stroke="#6B7280" 
                    tickLine={false} 
                    axisLine={false} 
                />
                <Tooltip 
                    labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                    formatter={(value, name) => [`${value} kcal`, name.charAt(0).toUpperCase() + name.slice(1)]}
                />
                <Legend />
                <Bar dataKey="consumed" fill="#f87171" name="Consumed" />
                <Bar dataKey="burned" fill="#34d399" name="Burned" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CaloriesChart;