// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BMIChart from "./charts/BMIChart";
import CaloriesChart from "./charts/CaloriesChart";
import { useAuth } from "../context/AuthContext";
import { getCalorieSummary } from "../services/UserService";
// Import getCaloriesConsumedBurned and getHealthProgress
import { getHealthProgress, getCaloriesConsumedBurned } from "../services/HealthMetricService"; // Use this endpoint

const Dashboard = ({ users, exercises, meals, showLoginPrompt, onLoginClick }) => {
    // Get user details and authentication status from context
    const { user, userId, isAdmin, isAuthenticated } = useAuth();

    // State for various data points shown on the dashboard
    const [calorieSummary, setCalorieSummary] = useState(null); // Today's net calories
    const [bmiHistory, setBmiHistory] = useState([]);         // Data for BMI chart
    const [calorieChartData, setCalorieChartData] = useState([]); // Data for Calories chart
    const [summaryLoading, setSummaryLoading] = useState(true); // Loading state indicator

    // Fetch dashboard-specific data when user logs in or authentication state changes
    useEffect(() => {
        // Only fetch data if the user is authenticated, has a userId, and is not an admin
        if (isAuthenticated && userId && !isAdmin) {
            setSummaryLoading(true); // Start loading indicator

            const fetchAdvancedData = async () => {
                // --- Fetch Today's Calorie Summary (using UDF) ---
                try {
                    const summaryRes = await getCalorieSummary(userId);
                    setCalorieSummary(summaryRes.data.calorieSummary);
                } catch (e) {
                    console.error("Failed to fetch calorie summary:", e);
                    setCalorieSummary("N/A - Failed to fetch.");
                }

                // --- Fetch BMI History (using health_progress_view) ---
                try {
                    const progressRes = await getHealthProgress(userId);
                    const progressData = progressRes.data.map(item => ({
                        date: new Date(item.date).toISOString().split('T')[0], // Format date
                        bmi: item.bmi,
                    })).filter(item => item.bmi); // Ensure BMI exists
                    setBmiHistory(progressData);
                } catch (e) {
                    console.error("Failed to fetch BMI history:", e);
                    setBmiHistory([]);
                }

                // --- Fetch Raw Calorie Data and Aggregate on Frontend ---
                try {
                    // 1. Fetch potentially non-aggregated data from the view
                    const calorieRes = await getCaloriesConsumedBurned(userId);
                    const rawData = calorieRes.data; // Array like [{ date, consumed, burned }, { date, ...}]

                    // ***** Log the raw data received from API *****
                    console.log("Raw Data Received from API:", rawData);
                    // ***********************************************

                    // 2. Aggregate the raw data by date on the frontend
                    const dailyTotals = {};
                    rawData.forEach(item => {
                        const dateStr = new Date(item.date).toISOString().split('T')[0]; // Normalize date format
                        if (!dailyTotals[dateStr]) {
                            // Initialize if date doesn't exist yet
                            dailyTotals[dateStr] = {
                                date: dateStr,
                                consumed: 0,
                                burned: 0
                            };
                        }
                        // Add current item's values to the daily total
                        dailyTotals[dateStr].consumed += item.calories_consumed || 0;
                        dailyTotals[dateStr].burned += item.calories_burned || 0;
                    });

                    // 3. Convert the aggregated totals object into an array and sort by date
                    const aggregatedChartData = Object.values(dailyTotals)
                        .sort((a, b) => new Date(a.date) - new Date(b.date));

                    // Optional: Limit to the last 7 days if desired
                    // const last7DaysData = aggregatedChartData.slice(-7);
                    // setCalorieChartData(last7DaysData);

                    // ***** Log the aggregated data *****
                    console.log("Aggregated Data for Chart:", aggregatedChartData);
                    // ************************************

                    // 4. Set the aggregated data for the chart state
                    setCalorieChartData(aggregatedChartData);

                } catch (e) {
                    console.error("Failed to fetch and aggregate calorie chart data:", e);
                    setCalorieChartData([]); // Set to empty array on failure
                }
                // --- End of Frontend Aggregation Logic ---

                setSummaryLoading(false); // Stop loading indicator
            };

            fetchAdvancedData(); // Execute the data fetching
        } else {
            // Reset state if user is not authenticated, is an admin, or userId is missing
            setCalorieSummary(null);
            setBmiHistory([]);
            setCalorieChartData([]);
            setSummaryLoading(false);
        }
    }, [userId, isAuthenticated, isAdmin]); // Re-run effect if these values change


    // Extract user details from context for display
    const activeUserName = user?.name;
    const activeUserWeight = user?.weight;

    // --- Aggregated Stats (User Only) ---
    const totalExercises = exercises.length; // Count based on basic list fetch (prop)
    const totalMeals = meals.length;         // Count based on basic list fetch (prop)
    const displayBMI = user?.bmi ? parseFloat(user.bmi).toFixed(1) : 'N/A';
    const displayWeight = activeUserWeight ? `${activeUserWeight} kg` : 'N/A';

    // Logic for displaying net calorie status
    let netCaloriesDisplay = calorieSummary || "Loading...";
    const isSurplus = calorieSummary ? calorieSummary.includes("surplus") : false;
    const netCaloriesValue = calorieSummary ? netCaloriesDisplay.split(': ')[1] : netCaloriesDisplay;


    // Reusable Stat Card component
    const StatCard = ({ title, value, icon, color }) => (
        <motion.div
            className="card text-center flex flex-col justify-center items-center p-4"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
            <div className={`text-4xl p-3 rounded-full bg-opacity-10 mb-3`} style={{ backgroundColor: color, color: 'white' }}>
                <span style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))' }}>{icon}</span>
            </div>
            <p className="text-sm font-medium text-text-muted">{title}</p>
            <h3 className="text-2xl md:text-3xl font-extrabold text-text-dark mt-1">{value}</h3>
        </motion.div>
    );

    // --- RENDER LOGIC ---

    // Display for users who are not logged in
    if (showLoginPrompt) {
         return (
             <motion.div
                className="space-y-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
            >
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto pt-8">
                    <motion.h1
                        className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-accent-green mb-6"
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        Transform Your Fitness Journey
                    </motion.h1>
                    <motion.p
                        className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Track workouts, monitor nutrition, and achieve your health goals with our comprehensive fitness platform.
                    </motion.p>
                    <motion.button
                        className="btn-primary text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        onClick={() => onLoginClick("login")} // Use specific action
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        🚀 Start Your Fitness Journey
                    </motion.button>
                </div>
                {/* Features Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                >
                    <div className="card text-center p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary-blue">
                        <div className="text-5xl mb-4">📊</div>
                        <h3 className="text-2xl font-bold text-text-dark mb-4">Advanced Analytics</h3>
                        <p className="text-text-muted">
                            Track BMI, calories, and progress with beautiful charts and insights to optimize your fitness strategy.
                        </p>
                    </div>
                    <div className="card text-center p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-t-accent-green">
                        <div className="text-5xl mb-4">💪</div>
                        <h3 className="text-2xl font-bold text-text-dark mb-4">Workout Tracking</h3>
                        <p className="text-text-muted">
                            Log exercises, monitor calories burned, and build personalized workout routines that deliver results.
                        </p>
                    </div>
                    <div className="card text-center p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-t-accent-red">
                        <div className="text-5xl mb-4">🍎</div>
                        <h3 className="text-2xl font-bold text-text-dark mb-4">Nutrition Monitoring</h3>
                        <p className="text-text-muted">
                            Track meals, count calories, and maintain perfect balance between nutrition and exercise goals.
                        </p>
                    </div>
                </motion.div>
                {/* Demo Preview Section */}
                <motion.div
                    className="card p-8 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-primary-blue border-opacity-20"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold text-center text-text-dark mb-6">See What Awaits You</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-4 text-center shadow-md">
                            <div className="text-2xl mb-2">⚖️</div>
                            <p className="font-semibold text-text-dark">BMI Tracking</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center shadow-md">
                            <div className="text-2xl mb-2">📈</div>
                            <p className="font-semibold text-text-dark">Progress Charts</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center shadow-md">
                            <div className="text-2xl mb-2">🔥</div>
                            <p className="font-semibold text-text-dark">Calorie Analysis</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center shadow-md">
                            <div className="text-2xl mb-2">🎯</div>
                            <p className="font-semibold text-text-dark">Goal Setting</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <button
                            className="btn-primary px-8 py-3 rounded-full font-semibold"
                            onClick={() => onLoginClick("register")} // Changed to trigger register modal
                        >
                            🔑 Unlock All Features - Join Now!
                        </button>
                    </div>
                </motion.div>
                {/* Testimonial */}
                <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                >
                     <p className="text-text-muted italic text-lg">
                        "FitTrack Pro helped me lose 15kg and maintain my ideal weight for over a year!"
                    </p>
                    <p className="text-text-dark font-semibold mt-2">- Sarah M., FitTrack Pro User</p>
                </motion.div>
            </motion.div>
         );
    }

    // Display for Admin users
    if (isAdmin) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
            >
                <h1 className="text-3xl font-bold text-accent-green">Admin Panel 👑</h1>
                <p className="text-text-muted">Welcome back, {activeUserName || 'Admin'}. You have oversight over **{users.length}** registered users.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Registered Users" value={users.length} icon="👥" color="#4F46E5" />
                    <StatCard title="Actions Available" value="Manage Users" icon="🛠️" color="#F59E0B" />
                    <StatCard title="Add New User" value="Register User" icon="➕" color="#10B981" />
                </div>
                <motion.div
                    className="card p-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-xl font-semibold text-text-dark mb-4">Quick Links</h2>
                    <ul className="space-y-2">
                         <li>
                            <button onClick={() => onLoginClick("users")} className="text-primary-blue hover:underline">
                                View All User Profiles
                            </button>
                        </li>
                        <li>
                             <button onClick={() => onLoginClick("addUser")} className="text-primary-blue hover:underline">
                                Manually Register a New User
                            </button>
                        </li>
                    </ul>
                </motion.div>
            </motion.div>
        );
    }

    // Display for regular logged-in users
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <h1 className="text-3xl font-bold text-text-dark">Hello, {activeUserName || 'User'}!</h1>
            <p className="text-xl text-text-muted">Here is your daily fitness overview.</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard title="Current BMI" value={displayBMI} icon="⚖️" color="#4F46E5" />
                <StatCard title="Current Weight" value={displayWeight} icon="🏋️" color="#10B981" />
                <StatCard title="Total Workouts" value={totalExercises} icon="💪" color="#F59E0B" />
                <StatCard title="Total Meals" value={totalMeals} icon="🍎" color="#EF4444" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Net Calories Card */}
                 <motion.div
                    className={`card col-span-1 p-6 text-center
                        ${isSurplus ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}
                    whileHover={{ y: -5 }}
                >
                    <h3 className="text-lg font-semibold text-text-dark mb-2">Net Calories Today</h3>
                    {summaryLoading ? (
                        <div className="flex items-center justify-center h-10">
                            <svg className="animate-spin h-5 w-5 text-text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        </div>
                    ) : (
                        <>
                            <p className={`text-xl md:text-3xl lg:text-4xl font-extrabold ${isSurplus ? 'text-accent-red' : 'text-accent-green'}`}>
                                {netCaloriesValue}
                            </p>
                            <p className="text-sm text-text-muted mt-2">
                                {isSurplus ? 'Surplus Today' : 'Deficit/Balance Today'}
                            </p>
                        </>
                    )}
                </motion.div>

                {/* Calories Chart */}
                <div className="card col-span-2">
                    <h3 className="text-xl font-bold text-primary-blue mb-4">Weekly Calorie Trends 📈</h3>
                    <CaloriesChart data={calorieChartData} /> {/* Uses aggregated data */}
                </div>
            </div>

            {/* BMI History Chart */}
            <div className="card">
                <h3 className="text-xl font-bold text-primary-blue mb-4">BMI History ⚖️</h3>
                <BMIChart data={bmiHistory} />
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Exercises */}
                <div className="card">
                    <h3 className="text-xl font-bold text-text-dark mb-4 border-b border-gray-100 pb-3">Recent Workouts 💪</h3>
                    <div className="space-y-3">
                        {exercises.slice(0, 3).map((exercise, index) => (
                            <motion.div
                                key={exercise.exerciseId || index}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span className="font-medium text-text-dark">{exercise.exerciseName}</span>
                                <span className="text-sm text-text-muted">{exercise.durationMinutes} min / {exercise.caloriesBurned} kcal</span>
                            </motion.div>
                        ))}
                        {exercises.length === 0 && <p className="text-text-muted">No recent workouts logged.</p>}
                    </div>
                </div>

                {/* Recent Meals */}
                <div className="card">
                    <h3 className="text-xl font-bold text-text-dark mb-4 border-b border-gray-100 pb-3">Recent Meals 🍎</h3>
                    <div className="space-y-3">
                        {meals.slice(0, 3).map((meal, index) => (
                            <motion.div
                                key={meal.mealId || index}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span className="font-medium text-text-dark">{meal.mealName}</span>
                                <span className="text-sm text-text-muted">{meal.caloriesConsumed} kcal</span>
                            </motion.div>
                        ))}
                        {meals.length === 0 && <p className="text-text-muted">No recent meals logged.</p>}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;