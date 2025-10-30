// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BMIChart from "./charts/BMIChart";
import CaloriesChart from "./charts/CaloriesChart";
import { useAuth } from "../context/AuthContext";
import { getCalorieSummary } from "../services/UserService";
import { getHealthProgress, getCaloriesConsumedBurned } from "../services/HealthMetricService";

// Import images - you'll need to add these to your assets folder
import fitnessAnalytics from "../assets/images/fitness-analytics.jpg";
import workoutTracking from "../assets/images/workout-tracking.jpg";
import nutritionMonitoring from "../assets/images/nutrition-monitoring.jpg";
import bmiTracking from "../assets/images/bmi-tracking.jpg";
import progressCharts from "../assets/images/progress-charts.jpg";
import calorieAnalysis from "../assets/images/calorie-analysis.jpg";
import goalSetting from "../assets/images/goal-setting.jpg";
import userProfile from "../assets/images/user-profile.jpg";

// Import icons
import {
    FaUser,
    FaUsers,
    FaTools,
    FaPlus,
    FaWeight,
    FaRunning,
    FaUtensils,
    FaChartLine,
    FaFire,
    FaBalanceScale,
    FaClipboardList,
    FaSeedling,
    FaCrown,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';

const Dashboard = ({ users, exercises, meals, showLoginPrompt, onLoginClick }) => {
    const { user, userId, isAdmin, isAuthenticated } = useAuth();

    const [calorieSummary, setCalorieSummary] = useState(null);
    const [bmiHistory, setBmiHistory] = useState([]);
    const [calorieChartData, setCalorieChartData] = useState([]);
    const [summaryLoading, setSummaryLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated && userId && !isAdmin) {
            setSummaryLoading(true);

            const fetchAdvancedData = async () => {
                try {
                    const summaryRes = await getCalorieSummary(userId);
                    setCalorieSummary(summaryRes.data.calorieSummary);
                } catch (e) {
                    console.error("Failed to fetch calorie summary:", e);
                    setCalorieSummary("N/A - Failed to fetch.");
                }

                try {
                    const progressRes = await getHealthProgress(userId);
                    const progressData = progressRes.data.map(item => ({
                        date: new Date(item.date).toISOString().split('T')[0],
                        bmi: item.bmi,
                    })).filter(item => item.bmi);
                    setBmiHistory(progressData);
                } catch (e) {
                    console.error("Failed to fetch BMI history:", e);
                    setBmiHistory([]);
                }

                try {
                    const calorieRes = await getCaloriesConsumedBurned(userId);
                    const rawData = calorieRes.data;
                    console.log("Raw Data Received from API:", rawData);

                    const dailyTotals = {};
                    rawData.forEach(item => {
                        const dateStr = new Date(item.date).toISOString().split('T')[0];
                        if (!dailyTotals[dateStr]) {
                            dailyTotals[dateStr] = {
                                date: dateStr,
                                consumed: 0,
                                burned: 0
                            };
                        }
                        dailyTotals[dateStr].consumed += item.calories_consumed || 0;
                        dailyTotals[dateStr].burned += item.calories_burned || 0;
                    });

                    const aggregatedChartData = Object.values(dailyTotals)
                        .sort((a, b) => new Date(a.date) - new Date(b.date));

                    console.log("Aggregated Data for Chart:", aggregatedChartData);
                    setCalorieChartData(aggregatedChartData);

                } catch (e) {
                    console.error("Failed to fetch and aggregate calorie chart data:", e);
                    setCalorieChartData([]);
                }

                setSummaryLoading(false);
            };

            fetchAdvancedData();
        } else {
            setCalorieSummary(null);
            setBmiHistory([]);
            setCalorieChartData([]);
            setSummaryLoading(false);
        }
    }, [userId, isAuthenticated, isAdmin]);

    const activeUserName = user?.name;
    const activeUserWeight = user?.weight;

    const totalExercises = exercises.length;
    const totalMeals = meals.length;
    const displayBMI = user?.bmi ? parseFloat(user.bmi).toFixed(1) : 'N/A';
    const displayWeight = activeUserWeight ? `${activeUserWeight} kg` : 'N/A';

    let netCaloriesDisplay = calorieSummary || "Loading...";
    const isSurplus = calorieSummary ? calorieSummary.includes("surplus") : false;
    const netCaloriesValue = calorieSummary ? netCaloriesDisplay.split(': ')[1] : netCaloriesDisplay;

    const StatCard = ({ title, value, icon, color, image }) => (
        <motion.div
            className="card text-center flex flex-col justify-center items-center p-6 relative overflow-hidden group bg-gradient-to-br from-white to-gray-50 border border-gray-200"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
            {image && (
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} mb-4 relative z-10 text-white shadow-lg`}>
                {icon}
            </div>
            <p className="text-sm font-medium text-text-muted relative z-10">{title}</p>
            <h3 className="text-2xl md:text-3xl font-extrabold text-text-dark mt-2 relative z-10">{value}</h3>
        </motion.div>
    );

    const FeatureCard = ({ title, description, image, borderColor, icon, delay }) => (
        <motion.div
            className="card p-8 hover:shadow-xl transition-all duration-300 border-l-4 relative overflow-hidden group bg-white border border-gray-200"
            style={{ borderLeftColor: borderColor }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay, duration: 0.7 }}
            whileHover={{ y: -5 }}
        >
            {image && (
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-blue to-accent-green flex items-center justify-center text-white text-2xl mb-6 shadow-lg">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-4">{title}</h3>
                <p className="text-text-muted leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );

    if (showLoginPrompt) {
        return (
            <motion.div
                className="space-y-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
            >
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto pt-12">
                    <motion.h1
                        className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-accent-green mb-8"
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        Transform Your Fitness Journey
                    </motion.h1>
                    <motion.p
                        className="text-xl text-text-muted mb-12 max-w-2xl mx-auto leading-relaxed"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Track workouts, monitor nutrition, and achieve your health goals with our comprehensive fitness platform.
                    </motion.p>
                    <motion.button
                        className="btn-primary text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold bg-gradient-to-r from-primary-blue to-accent-green text-white"
                        onClick={() => onLoginClick("login")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        Start Your Fitness Journey
                    </motion.button>
                </div>

                {/* Features Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                >
                    <FeatureCard
                        title="Advanced Analytics"
                        description="Track BMI, calories, and progress with beautiful charts and insights to optimize your fitness strategy."
                        image={fitnessAnalytics}
                        icon={<FaChartLine />}
                        borderColor="#4F46E5"
                        delay={0.1}
                    />
                    <FeatureCard
                        title="Workout Tracking"
                        description="Log exercises, monitor calories burned, and build personalized workout routines that deliver results."
                        image={workoutTracking}
                        icon={<FaRunning />}
                        borderColor="#10B981"
                        delay={0.2}
                    />
                    <FeatureCard
                        title="Nutrition Monitoring"
                        description="Track meals, count calories, and maintain perfect balance between nutrition and exercise goals."
                        image={nutritionMonitoring}
                        icon={<FaSeedling />}
                        borderColor="#EF4444"
                        delay={0.3}
                    />
                </motion.div>

                {/* Demo Preview Section */}
                <motion.div
                    className="card p-10 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-primary-blue border-opacity-20 rounded-2xl"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold text-center text-text-dark mb-8">See What Awaits You</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-primary-blue text-xl mb-4 mx-auto">
                                <FaBalanceScale />
                            </div>
                            <p className="font-semibold text-text-dark">BMI Tracking</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-accent-green text-xl mb-4 mx-auto">
                                <FaChartLine />
                            </div>
                            <p className="font-semibold text-text-dark">Progress Charts</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-accent-red text-xl mb-4 mx-auto">
                                <FaFire />
                            </div>
                            <p className="font-semibold text-text-dark">Calorie Analysis</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-xl mb-4 mx-auto">
                                <FaClipboardList />
                            </div>
                            <p className="font-semibold text-text-dark">Goal Setting</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <button
                            className="btn-primary px-10 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-primary-blue to-accent-green text-white"
                            onClick={() => onLoginClick("register")}
                        >
                            Unlock All Features - Join Now
                        </button>
                    </div>
                </motion.div>

                {/* Testimonial */}
                <motion.div
                    className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                >
                    <div className="max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-gradient-to-r from-primary-blue to-accent-green rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            SM
                        </div>
                        <p className="text-text-muted italic text-lg mb-4 leading-relaxed">
                            "FitTrack Pro helped me lose 15kg and maintain my ideal weight for over a year! The analytics and tracking features made all the difference."
                        </p>
                        <p className="text-text-dark font-semibold">Sarah M., FitTrack Pro User</p>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    if (isAdmin) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent-green to-primary-blue rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        <FaCrown />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-text-dark">Admin Panel</h1>
                        <p className="text-text-muted">Welcome back, {activeUserName || 'Admin'}</p>
                    </div>
                </div>

                <p className="text-text-muted">You have oversight over <strong>{users.length}</strong> registered users.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Registered Users"
                        value={users.length}
                        icon={<FaUsers />}
                        color="from-blue-500 to-blue-600"
                    />
                    <StatCard
                        title="Actions Available"
                        value="Manage Users"
                        icon={<FaTools />}
                        color="from-yellow-500 to-yellow-600"
                    />
                    <StatCard
                        title="Add New User"
                        value="Register User"
                        icon={<FaPlus />}
                        color="from-green-500 to-green-600"
                    />
                </div>

                <motion.div
                    className="card p-8 border border-gray-200"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-xl font-semibold text-text-dark mb-6 border-b border-gray-100 pb-4">Quick Links</h2>
                    <div className="space-y-4">
                        <button
                            onClick={() => onLoginClick("users")}
                            className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-primary-blue hover:bg-blue-50 transition-all duration-300 flex items-center gap-4 group"
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-primary-blue group-hover:scale-110 transition-transform">
                                <FaUsers />
                            </div>
                            <div>
                                <p className="font-medium text-text-dark">View All User Profiles</p>
                                <p className="text-sm text-text-muted">Manage and monitor all registered users</p>
                            </div>
                        </button>
                        <button
                            onClick={() => onLoginClick("addUser")}
                            className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-accent-green hover:bg-green-50 transition-all duration-300 flex items-center gap-4 group"
                        >
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-accent-green group-hover:scale-110 transition-transform">
                                <FaUser />
                            </div>
                            <div>
                                <p className="font-medium text-text-dark">Register New User</p>
                                <p className="text-sm text-text-muted">Manually create a new user account</p>
                            </div>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 bg-gradient-to-r from-primary-blue to-accent-green rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {activeUserName ? activeUserName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-text-dark">Welcome back, {activeUserName || 'User'}!</h1>
                    <p className="text-xl text-text-muted">Here is your daily fitness overview</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard
                    title="Current BMI"
                    value={displayBMI}
                    icon={<FaBalanceScale />}
                    color="from-blue-500 to-blue-600"
                />
                <StatCard
                    title="Current Weight"
                    value={displayWeight}
                    icon={<FaWeight />}
                    color="from-green-500 to-green-600"
                />
                <StatCard
                    title="Total Workouts"
                    value={totalExercises}
                    icon={<FaRunning />}
                    color="from-yellow-500 to-yellow-600"
                />
                <StatCard
                    title="Total Meals"
                    value={totalMeals}
                    icon={<FaUtensils />}
                    color="from-red-500 to-red-600"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    className={`card col-span-1 p-6 text-center relative overflow-hidden border ${
                        isSurplus ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                    }`}
                    whileHover={{ y: -5 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white opacity-60"></div>
                    <div className="relative z-10">
                        <h3 className="text-lg font-semibold text-text-dark mb-4">Net Calories Today</h3>
                        {summaryLoading ? (
                            <div className="flex items-center justify-center h-10">
                                <svg className="animate-spin h-5 w-5 text-text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    {isSurplus ? (
                                        <FaArrowUp className="text-accent-red text-xl" />
                                    ) : (
                                        <FaArrowDown className="text-accent-green text-xl" />
                                    )}
                                    <p className={`text-xl md:text-3xl lg:text-4xl font-extrabold ${
                                        isSurplus ? 'text-accent-red' : 'text-accent-green'
                                    }`}>
                                        {netCaloriesValue}
                                    </p>
                                </div>
                                <p className="text-sm text-text-muted">
                                    {isSurplus ? 'Calorie Surplus Today' : 'Calorie Deficit Today'}
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>

                <div className="card col-span-2 border border-gray-200">
                    <h3 className="text-xl font-bold text-primary-blue mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                        <FaChartLine />
                        Weekly Calorie Trends
                    </h3>
                    <CaloriesChart data={calorieChartData} />
                </div>
            </div>

            <div className="card border border-gray-200">
                <h3 className="text-xl font-bold text-primary-blue mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                    <FaBalanceScale />
                    BMI History
                </h3>
                <BMIChart data={bmiHistory} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card border border-gray-200">
                    <h3 className="text-xl font-bold text-text-dark mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                        <FaRunning />
                        Recent Workouts
                    </h3>
                    <div className="space-y-4">
                        {exercises.slice(0, 3).map((exercise, index) => (
                            <motion.div
                                key={exercise.exerciseId || index}
                                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300 border border-gray-200"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 border border-orange-200">
                                        <FaRunning />
                                    </div>
                                    <span className="font-medium text-text-dark">{exercise.exerciseName}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm text-text-muted block">{exercise.durationMinutes} minutes</span>
                                    <span className="text-sm font-medium text-accent-red">{exercise.caloriesBurned} kcal</span>
                                </div>
                            </motion.div>
                        ))}
                        {exercises.length === 0 && (
                            <p className="text-text-muted text-center py-8">No recent workouts logged</p>
                        )}
                    </div>
                </div>

                <div className="card border border-gray-200">
                    <h3 className="text-xl font-bold text-text-dark mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                        <FaUtensils />
                        Recent Meals
                    </h3>
                    <div className="space-y-4">
                        {meals.slice(0, 3).map((meal, index) => (
                            <motion.div
                                key={meal.mealId || index}
                                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300 border border-gray-200"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 border border-green-200">
                                        <FaUtensils />
                                    </div>
                                    <span className="font-medium text-text-dark">{meal.mealName}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-medium text-accent-green">{meal.caloriesConsumed} kcal</span>
                                </div>
                            </motion.div>
                        ))}
                        {meals.length === 0 && (
                            <p className="text-text-muted text-center py-8">No recent meals logged</p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;