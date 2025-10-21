// src/components/Dashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import BMIChart from "./charts/BMIChart";
import CaloriesChart from "./charts/CaloriesChart";
import { useAuth } from "../context/AuthContext"; 

// Helper function to calculate total calories (for simplicity)
const calculateTotalCalories = (items, key) => items.reduce((acc, item) => acc + (item[key] || 0), 0);

const Dashboard = ({ users, exercises, meals, showLoginPrompt, onLoginClick }) => {
    // FIX: Get isAdmin flag from context
    const { user, isAdmin } = useAuth();
    
    // Extract user details from context or default to null
    const activeUserName = user?.name;
    const activeUserWeight = user?.weight;
    const activeUserHeight = user?.height;

    // --- Aggregated Stats (User Only) ---
    const totalExercises = exercises.length;
    const totalMeals = meals.length;
    const totalCaloriesBurned = calculateTotalCalories(exercises, 'caloriesBurned');
    const totalCaloriesConsumed = calculateTotalCalories(meals, 'caloriesConsumed');
    const netCalories = totalCaloriesConsumed - totalCaloriesBurned;

    // Calculate BMI
    const demoBMI = (activeUserWeight && activeUserHeight > 0) 
        ? (activeUserWeight / ((activeUserHeight / 100) ** 2)).toFixed(1) 
        : 'N/A';
        
    const demoWeight = activeUserWeight ? `${activeUserWeight} kg` : 'N/A';

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

    // ENHANCED: Attractive Pre-Login Dashboard
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
                        onClick={onLoginClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        🚀 Start Your Fitness Journey - Log In / Register
                    </motion.button>
                </div>

                {/* Features Grid */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                >
                    {/* Feature 1 */}
                    <div className="card text-center p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary-blue">
                        <div className="text-5xl mb-4">📊</div>
                        <h3 className="text-2xl font-bold text-text-dark mb-4">Advanced Analytics</h3>
                        <p className="text-text-muted">
                            Track BMI, calories, and progress with beautiful charts and insights to optimize your fitness strategy.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="card text-center p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-t-accent-green">
                        <div className="text-5xl mb-4">💪</div>
                        <h3 className="text-2xl font-bold text-text-dark mb-4">Workout Tracking</h3>
                        <p className="text-text-muted">
                            Log exercises, monitor calories burned, and build personalized workout routines that deliver results.
                        </p>
                    </div>

                    {/* Feature 3 */}
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
                            onClick={onLoginClick}
                        >
                            🔑 Unlock All Features - Join Now!
                        </button>
                    </div>
                </motion.div>

                {/* Testimonial/Stats Section */}
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
    
    // --- NEW: ADMIN DASHBOARD VIEW ---
    if (isAdmin) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
            >
                <h1 className="text-3xl font-bold text-accent-green">Admin Dashboard 👑</h1>
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
    
    // --- EXISTING: USER DASHBOARD VIEW ---
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <h1 className="text-xl font-semibold text-text-dark">Hi {activeUserName || 'User'}! Here is your progress snapshot.</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard title="Current BMI" value={demoBMI} icon="⚖️" color="#4F46E5" />
                <StatCard title="Current Weight" value={demoWeight} icon="🏋️" color="#10B981" />
                <StatCard title="Workouts Logged" value={totalExercises} icon="💪" color="#F59E0B" />
                <StatCard title="Meals Tracked" value={totalMeals} icon="🍎" color="#EF4444" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Net Calories Card */}
                 <motion.div 
                    className={`card col-span-1 p-6 text-center 
                        ${netCalories > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}
                    whileHover={{ y: -5 }}
                >
                    <h3 className="text-lg font-semibold text-text-dark mb-2">Net Calories (Consumed - Burned)</h3>
                    <p className={`text-4xl font-extrabold ${netCalories > 0 ? 'text-accent-red' : 'text-accent-green'}`}>
                        {netCalories.toFixed(0)} kcal
                    </p>
                    <p className="text-sm text-text-muted mt-2">
                        {netCalories > 0 ? 'Calorie Surplus - Track more exercise!' : 'Calorie Deficit/Maintenance - Great job!'}
                    </p>
                </motion.div>

                {/* Charts */}
                <div className="card col-span-2">
                    <h3 className="text-xl font-bold text-primary-blue mb-4">Weekly Health Trends</h3>
                    <CaloriesChart />
                </div>
            </div>

            {/* BMI History (Standalone Chart) */}
            <div className="card">
                <h3 className="text-xl font-bold text-primary-blue mb-4">BMI History</h3>
                <BMIChart />
            </div>

            {/* Recent Activities - Minimalist view */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Exercises */}
                <div className="card">
                    <h3 className="text-xl font-bold text-text-dark mb-4 border-b border-gray-100 pb-3">Recent Workouts 💪</h3>
                    <div className="space-y-3">
                        {exercises.slice(0, 3).map((exercise, index) => (
                            <motion.div 
                                key={index} 
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
                                key={index} 
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