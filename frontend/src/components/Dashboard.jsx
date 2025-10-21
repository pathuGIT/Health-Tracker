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

    if (showLoginPrompt) {
        return (
            <motion.div 
                className="card text-center max-w-2xl mx-auto p-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-extrabold text-primary-blue mb-4">Welcome to FitTrack Pro</h1>
                <p className="text-text-muted mb-6">
                    Log in or register to unlock your personalized health dashboard and start tracking your progress.
                </p>
                <button
                    className="btn-primary"
                    onClick={onLoginClick}
                >
                    🔑 Log In / Register Now
                </button>
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