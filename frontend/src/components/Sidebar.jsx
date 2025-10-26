// frontend/src/components/Sidebar.jsx
import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext"; 
import { getUnreadAlertsByUser } from "../services/AlertService"; // Import the alert service

const Sidebar = ({ activeTab, setActiveTab, onLogout, authToken }) => {
    // FIX: Get userRole, isAdmin, and userId from context
    const { userRole, isAdmin, userId, isAuthenticated, isAuthLoading } = useAuth(); // Added userId, isAuthenticated, isAuthLoading
    
    // NEW STATE: To store the count of unread alerts
    const [unreadAlertCount, setUnreadAlertCount] = useState(0);

    // Fetch unread alert count when the component mounts or auth state changes
    useEffect(() => {
        // Only fetch if authenticated, not admin, and auth loading is done
        if (isAuthenticated && userId && !isAdmin && !isAuthLoading) {
            const fetchCount = async () => {
                try {
                    const response = await getUnreadAlertsByUser(userId);
                    // The response.data should be an array of unread alerts
                    setUnreadAlertCount(response.data.length); 
                } catch (error) {
                    console.error("Failed to fetch unread alert count:", error);
                    setUnreadAlertCount(0); // Reset on error
                }
            };
            fetchCount();
        } else {
            setUnreadAlertCount(0); // Reset if not logged in or admin
        }
    }, [userId, isAuthenticated, isAdmin, isAuthLoading]); // Dependencies for the effect


    const allUserItems = [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "profile", label: "My Profile", icon: "👤" },
        { id: "exercises", label: "Workouts", icon: "💪" },
        { id: "meals", label: "Nutrition", icon: "🍎" },
        { id: "addExercise", label: "Log Workout", icon: "🏋️" },
        { id: "addMeal", label: "Log Meal", icon: "🍽️" },
        { id: "updateBMI", label: "Update Metrics", icon: "⚖️" },
        { id: "alerts", label: "Alerts", icon: "🔔" }, // Item for alerts
    ];

    const adminItems = [
        { id: "dashboard", label: "Admin Dashboard", icon: "👑" },
        { id: "users", label: "Manage Users", icon: "👥" },
        { id: "addUser", label: "Register New User", icon: "➕" },
    ];

    const unauthenticatedItems = [
        { id: "dashboard", label: "Home", icon: "🏠" },
        { id: "login", label: "Login", icon: "🔑" },
        { id: "register", label: "Register", icon: "📝" },
    ];

    // Determine the set of links to show
    let filteredNavItems = [];
    if (!authToken) {
        filteredNavItems = unauthenticatedItems;
    } else if (isAdmin) {
        filteredNavItems = adminItems;
    } else {
        filteredNavItems = allUserItems;
    }

    if (authToken && !userRole && !isAuthLoading) { // Handle brief loading state
        filteredNavItems = allUserItems; // Default assumption for loading
    }

    const topSpacingClass = authToken ? 'h-[72px]' : 'mb-8'; 

    return (
        <motion.div
            className="fixed top-0 left-0 h-screen w-64 bg-card-white shadow-3xl p-4 flex flex-col z-20"
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            <div className={`mb-4 p-2 ${topSpacingClass} flex items-end justify-start`}>
                 {authToken && userRole && (
                    <p className="text-xs font-medium text-text-muted px-1"></p>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow space-y-2 overflow-y-auto">
                {filteredNavItems.map(item => (
                    <motion.button
                        key={item.id}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left 
                            ${activeTab === item.id
                                ? 'bg-primary-blue text-white shadow-lg'
                                : 'text-text-dark hover:bg-gray-100'}`}
                        onClick={() => setActiveTab(item.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center">
                            <span className="mr-3 text-xl">{item.icon}</span>
                            {item.label}
                        </div>
                        {/* NEW: Badge for Alerts */}
                        {item.id === 'alerts' && unreadAlertCount > 0 && (
                            <span className="ml-auto bg-accent-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {unreadAlertCount}
                            </span>
                        )}
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