import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMealsByUser } from "../services/MealService";

const DEMO_USER_ID = 1;

const Meals = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getMealsByUser(DEMO_USER_ID);

                let mealsData = response.data;

                if (Array.isArray(mealsData)) {
                    setMeals(mealsData);
                } else if (mealsData && mealsData.data && Array.isArray(mealsData.data)) {
                    setMeals(mealsData.data);
                } else if (mealsData && mealsData.meals && Array.isArray(mealsData.meals)) {
                    setMeals(mealsData.meals);
                } else {
                    setMeals([]);
                }

            } catch (err) {
                console.error("Error fetching meals:", err);
                if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNREFUSED') {
                    setError("Cannot connect to server. Make sure the backend is running on port 8080.");
                } else if (err.response) {
                    setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
                } else if (err.request) {
                    setError("No response from server. Check if the server is running.");
                } else {
                    setError("Failed to fetch meals: " + err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMeals();
    }, []);

    if (loading) {
        return (
             <div className="card text-center py-12">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-text-muted">Loading meal log...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <div className="text-accent-red text-4xl mb-4">⚠️</div>
                    <h3 className="text-text-dark font-semibold text-lg mb-2">Error Loading Meals</h3>
                    <p className="text-text-muted mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-accent-red text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex justify-between items-center">
                <p className="text-text-muted">
                    {meals.length} {meals.length === 1 ? 'meal' : 'meals'} logged for User ID {DEMO_USER_ID}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-100 text-text-dark rounded-xl hover:bg-gray-200 transition-colors font-semibold text-sm"
                >
                    Refresh
                </button>
            </div>

            {meals.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="text-6xl mb-4">🍎</div>
                    <h3 className="text-xl font-semibold text-text-dark mb-2">No Meals Found</h3>
                    <p className="text-text-muted">No meals have been logged for this user yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {meals.map((meal, index) => (
                        <motion.div
                            key={meal.mealId}
                            className="card bg-blue-50 border-blue-100"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-xl text-primary-blue">
                                        {meal.mealName}
                                    </h3>
                                    <p className="text-text-muted text-sm mt-1">User ID: {meal.userId}</p>
                                </div>
                                <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    🍽️
                                </div>
                            </div>

                            <div className="bg-red-100 px-4 py-3 rounded-xl text-center mb-4">
                                <p className="text-accent-red font-bold text-2xl">{meal.caloriesConsumed}</p>
                                <p className="text-text-muted text-sm">Calories Consumed</p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center text-xs text-text-muted">
                                    <span>Meal ID: {meal.mealId}</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded-lg">
                                        {meal.date ? new Date(meal.date).toLocaleDateString() : 'Unknown Date'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Meals;