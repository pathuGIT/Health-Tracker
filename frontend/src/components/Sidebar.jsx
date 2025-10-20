// frontend/src/components/Sidebar.jsx
import React from "react";
import { motion } from "framer-motion";

const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "exercises", label: "Workouts", icon: "💪" },
    { id: "meals", label: "Nutrition", icon: "🍎" },
    { id: "profile", label: "My Profile", icon: "👤" }, // Mapped from Profile.jsx
    { id: "addUser", label: "Register New User", icon: "➕" },
    { id: "addExercise", label: "Log Workout", icon: "🏋️" },
    { id: "addMeal", label: "Log Meal", icon: "🍽️" },
    { id: "updateBMI", label: "Update Metrics", icon: "⚖️" },
];

const Sidebar = ({ activeTab, setActiveTab, onLogout, authToken }) => {
    // Determine the set of links to show based on auth status
    const filteredNavItems = authToken ? navItems : [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "login", label: "Login", icon: "🔑" },
        { id: "register", label: "Register", icon: "📝" },
    ];

    return (
        <motion.div
            className="fixed top-0 left-0 h-screen w-64 bg-card-white shadow-3xl p-4 flex flex-col z-20"
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            {/* Logo/Header */}
            <div className="mb-8 p-2">
                <h1 className="text-3xl font-bold text-primary-blue flex items-center">
                    <span className="text-accent-green mr-2 text-4xl">💚</span> FitTrack Pro
                </h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow space-y-2 overflow-y-auto">
                {filteredNavItems.map(item => (
                    <motion.button
                        key={item.id}
                        className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left 
                            ${activeTab === item.id 
                                ? 'bg-primary-blue text-white shadow-lg' 
                                : 'text-text-dark hover:bg-gray-100'}`}
                        onClick={() => setActiveTab(item.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="mr-3 text-xl">{item.icon}</span>
                        {item.label}
                    </motion.button>
                ))}
            </nav>

            {/* Footer/Logout */}
            {authToken && (
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <motion.button
                        className="flex items-center w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left text-accent-red hover:bg-red-50"
                        onClick={onLogout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="mr-3 text-xl">🚪</span>
                        Log Out
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
};

export default Sidebar;