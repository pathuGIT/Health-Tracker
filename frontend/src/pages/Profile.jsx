// src/pages/Profile.jsx
import { motion } from "framer-motion";
import BMIChart from "../components/charts/BMIChart";
import CaloriesChart from "../components/charts/CaloriesChart";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
// Import the necessary service functions
import { getHealthProgress, getCaloriesConsumedBurned } from "../services/HealthMetricService"; // Ensure both are imported

const Profile = () => {
    // Get user object and authentication states from context
    const { user, userId, isAuthenticated, isAuthLoading } = useAuth();

    // States for chart data and loading indicators
    const [bmiHistory, setBmiHistory] = useState([]);
    const [calorieChartData, setCalorieChartData] = useState([]); // State to hold aggregated data
    const [chartsLoading, setChartsLoading] = useState(true);
    const [latestBmiCategory, setLatestBmiCategory] = useState('N/A'); // State for BMI Category

    // Fetch Advanced Data (Views)
    useEffect(() => {
        // Fetch only when authenticated and userId is available
        if (isAuthenticated && userId) {
            setChartsLoading(true); // Start loading

            const fetchChartsData = async () => {
                // --- 1. Fetch BMI History and Category ---
                try {
                    const progressRes = await getHealthProgress(userId);
                    // Assuming the data is sorted descending by date from the backend
                    const sortedProgressData = progressRes.data; // Use the raw data

                    if (sortedProgressData && sortedProgressData.length > 0) {
                        // Get the category from the most recent entry (first item)
                        setLatestBmiCategory(sortedProgressData[0].bmiCategory || 'N/A');

                        // Prepare data for the BMI chart (date and bmi value)
                        const chartBmiData = sortedProgressData.map(item => ({
                            date: new Date(item.date).toISOString().split('T')[0], // Format date
                            bmi: item.bmi,
                        })).filter(item => item.bmi); // Filter out entries without BMI
                        setBmiHistory(chartBmiData.reverse()); // Reverse for chronological chart order
                    } else {
                        setBmiHistory([]);
                        setLatestBmiCategory('N/A');
                    }
                } catch (e) {
                    console.error("Failed to fetch BMI history:", e);
                    setBmiHistory([]); // Reset on error
                    setLatestBmiCategory('N/A');
                }

                // --- 2. Fetch Raw Calorie Data and Aggregate ---
                try {
                    const calorieRes = await getCaloriesConsumedBurned(userId);
                    const rawData = calorieRes.data;

                    // Aggregate the raw data by date on the frontend
                    const dailyTotals = {};
                    rawData.forEach(item => {
                        const dateStr = new Date(item.date).toISOString().split('T')[0];
                        if (!dailyTotals[dateStr]) {
                            dailyTotals[dateStr] = { date: dateStr, consumed: 0, burned: 0 };
                        }
                        dailyTotals[dateStr].consumed += item.calories_consumed || 0;
                        dailyTotals[dateStr].burned += item.calories_burned || 0;
                    });

                    // Convert to array and sort
                    const aggregatedChartData = Object.values(dailyTotals)
                        .sort((a, b) => new Date(a.date) - new Date(b.date));

                    setCalorieChartData(aggregatedChartData);

                } catch (e) {
                    console.error("Failed to fetch and aggregate calorie chart data:", e);
                    setCalorieChartData([]);
                }
                // --- End of Calorie Data Logic ---

                setChartsLoading(false); // Stop loading
            };

            fetchChartsData(); // Execute the data fetching
        } else {
            // Reset state if not authenticated or userId is missing
            setBmiHistory([]);
            setCalorieChartData([]);
            setLatestBmiCategory('N/A');
            setChartsLoading(false);
        }
    }, [userId, isAuthenticated]); // Dependencies for the effect

    // Retrieve BMI value from the user context (this might be slightly different from the latest history entry if profile isn't updated immediately)
    const calculatedBMI = user?.bmi ? parseFloat(user.bmi).toFixed(1) : 'N/A';

    // Handle loading state
    if (isAuthLoading || chartsLoading) {
        return (
            <div className="card text-center py-12">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-text-muted">Loading user profile and charts...</p>
                </div>
            </div>
        );
    }

    // Handle unauthenticated state
    if (!isAuthenticated || !user) {
        return (
            <div className="card text-center py-12">
                <h3 className="text-xl font-semibold text-text-dark mb-2">Access Denied</h3>
                <p className="text-text-muted">Please log in to view your profile.</p>
            </div>
        );
    }

    const userName = user?.name || 'User';

    // Render the profile page
    return (
        <motion.div
            className="max-w-4xl mx-auto space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h1 className="text-3xl font-bold text-primary-blue mb-6 border-b pb-3">
                {userName}’s Profile 👤
            </h1>

            {/* User Info Card */}
            <motion.div
                className="card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" // Changed to 5 columns for BMI Category
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="lg:col-span-5 mb-2"> {/* Span all 5 columns */}
                    <h2 className="text-xl font-semibold text-text-dark border-b border-gray-100 pb-2">Personal Metrics</h2>
                </div>
                {/* Age */}
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-text-muted">Age</p>
                    <p className="text-xl font-bold text-text-dark">{user.age || 'N/A'}</p>
                </div>
                {/* Height */}
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-text-muted">Height</p>
                    <p className="text-xl font-bold text-text-dark">{user.height ? `${user.height} cm` : 'N/A'}</p>
                </div>
                {/* Weight */}
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-text-muted">Weight</p>
                    <p className="text-xl font-bold text-text-dark">{user.weight ? `${user.weight} kg` : 'N/A'}</p>
                </div>
                 {/* BMI Value */}
                <div className="bg-primary-blue bg-opacity-10 p-4 rounded-xl border border-primary-blue/20">
                    <p className="text-sm font-medium text-primary-blue">Current BMI</p>
                    <p className="text-xl font-bold text-primary-blue">{calculatedBMI}</p>
                </div>
                 {/* BMI Category - NEW */}
                 <div className="bg-green-100 p-4 rounded-xl border border-green-200">
                    <p className="text-sm font-medium text-accent-green">Category</p>
                    <p className="text-xl font-bold text-accent-green">{latestBmiCategory}</p>
                </div>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* BMI History Chart */}
                <motion.div
                    className="card p-6"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-xl font-semibold text-accent-green mb-4 border-b border-gray-100 pb-2">BMI History ⚖️</h2>
                    <BMIChart data={bmiHistory} /> {/* Pass fetched BMI data */}
                </motion.div>
                {/* Calories Chart */}
                <motion.div
                    className="card p-6"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-xl font-semibold text-primary-blue mb-4 border-b border-gray-100 pb-2">Calories Summary 📈</h2>
                    <CaloriesChart data={calorieChartData} /> {/* Pass aggregated calorie data */}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Profile;