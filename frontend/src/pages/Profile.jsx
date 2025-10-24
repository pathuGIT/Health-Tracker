// src/pages/Profile.jsx
import { motion } from "framer-motion";
import BMIChart from "../components/charts/BMIChart";
import CaloriesChart from "../components/charts/CaloriesChart";
import { useAuth } from "../context/AuthContext"; 
import { useEffect, useState } from "react"; 
import { getHealthProgress } from "../services/HealthMetricService";

const Profile = () => {
    // FIX: Get user object and authentication states from context
    const { user, userId, isAuthenticated, isAuthLoading } = useAuth(); // ADDED userId
    
    // --- NEW STATES FOR ADVANCED DATA ---
    const [bmiHistory, setBmiHistory] = useState([]);
    const [calorieChartData, setCalorieChartData] = useState([]); // Kept for consistency
    const [chartsLoading, setChartsLoading] = useState(true);

    // Fetch Advanced Data (Views)
    useEffect(() => {
        if (isAuthenticated && userId) {
            setChartsLoading(true);
            const fetchChartsData = async () => {
                // 1. Fetch Health Metrics Progress (BMI History View)
                try {
                    const progressRes = await getHealthProgress(userId);
                    const progressData = progressRes.data.map(item => ({
                        // Clean date for chart key
                        date: new Date(item.date).toISOString().split('T')[0], 
                        bmi: item.bmi,
                    })).filter(item => item.bmi); // Only keep records with BMI
                    setBmiHistory(progressData);
                } catch (e) {
                    console.error("Failed to fetch BMI history:", e);
                    setBmiHistory([]);
                }
                
                // 2. Mock/Placeholder Calorie Chart Data (Same as Dashboard for consistency)
                const mockChartData = [
                    { day: "Mon", consumed: 2200, burned: 1800, date: '2025-01-01' },
                    { day: "Tue", consumed: 2000, burned: 1900, date: '2025-01-02' },
                    { day: "Wed", consumed: 2500, burned: 2100, date: '2025-01-03' },
                    { day: "Thu", consumed: 2300, burned: 2000, date: '2025-01-04' },
                    { day: "Fri", consumed: 2400, burned: 2200, date: '2025-01-05' },
                ].map(item => ({
                    date: item.date, 
                    consumed: item.consumed, 
                    burned: item.burned 
                }));
                setCalorieChartData(mockChartData);
                
                setChartsLoading(false);
            };
            fetchChartsData();
        } else {
            // Reset state
            setBmiHistory([]);
            setCalorieChartData([]);
            setChartsLoading(false);
        }
    }, [userId, isAuthenticated]); // Depend on relevant auth states

    // FIX: Retrieve BMI directly from the user context object (fetched from backend)
    const calculatedBMI = user?.bmi ? parseFloat(user.bmi).toFixed(1) : 'N/A';
        
    // Handle loading state
    if (isAuthLoading || chartsLoading) { // Combined loading states
        return (
            <div className="card text-center py-12">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-text-muted">Loading user profile and charts...</p>
                </div>
            </div>
        );
    }

    // Handle unauthenticated state (should be caught by App.js, but good for robustness)
    if (!isAuthenticated || !user) {
        return (
            <div className="card text-center py-12">
                <h3 className="text-xl font-semibold text-text-dark mb-2">Access Denied</h3>
                <p className="text-text-muted">Please log in to view your profile.</p>
            </div>
        );
    }
    
    const userName = user?.name || 'User';

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

            {/* User Info Card - Using live user data */}
            <motion.div 
                className="card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="lg:col-span-4 mb-2">
                    <h2 className="text-xl font-semibold text-text-dark border-b border-gray-100 pb-2">Personal Metrics</h2>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-text-muted">Age</p>
                    <p className="text-xl font-bold text-text-dark">{user.age || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-text-muted">Height</p>
                    <p className="text-xl font-bold text-text-dark">{user.height ? `${user.height} cm` : 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-text-muted">Weight</p>
                    <p className="text-xl font-bold text-text-dark">{user.weight ? `${user.weight} kg` : 'N/A'}</p>
                </div>
                <div className="bg-primary-blue bg-opacity-10 p-4 rounded-xl border border-primary-blue/20">
                    <p className="text-sm font-medium text-primary-blue">Current BMI</p>
                    <p className="text-xl font-bold text-primary-blue">{calculatedBMI}</p>
                </div>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                    className="card p-6"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-xl font-semibold text-accent-green mb-4 border-b border-gray-100 pb-2">BMI History ⚖️</h2>
                    <BMIChart data={bmiHistory} /> 
                </motion.div>
                <motion.div 
                    className="card p-6"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-xl font-semibold text-primary-blue mb-4 border-b border-gray-100 pb-2">Calories Summary 📈</h2>
                    <CaloriesChart data={calorieChartData} /> 
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Profile;