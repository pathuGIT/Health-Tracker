// src/components/AddMeal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import api from '../services/Api';
import { logMeal } from "../services/MealService"; // Import the logMeal function
import { useAuth } from "../context/AuthContext"; // NEW IMPORT

const AddMeal = ({ onMealAdded }) => {
    // FIX: Get userId and isAuthenticated from context
    const { userId, isAuthenticated } = useAuth();
    // REMOVED local userId state (setUserId)
    const [name, setName] = useState("");
    const [calories, setCalories] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = () => {
        // FIX: Pre-check authentication status
        if (!isAuthenticated || !userId) {
            setError("Must be logged in to log a meal.");
            return;
        }

        setError(null);
        setLoading(true);

        // FIX: Use the userId from context
        logMeal({
            userId: userId,
            mealName: name,
            caloriesConsumed: parseFloat(calories)
        })
            .then(res => {
                alert("Meal logged successfully!");
                onMealAdded();
                // Clear form
                setName("");
                setCalories("");
            })
            .catch(err => {
                console.error(err);
                // FIX: Update error message extraction to be more robust
                const errorMessage = err.response?.data?.message || err.message || "Error logging meal. Check if User ID exists and server is running.";
                setError(errorMessage);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="p-2 space-y-6">
            <p className="text-text-muted">
                Track your calorie intake with a new meal entry.
            </p>
            {error && (
                <motion.div 
                    className="text-accent-red bg-red-100 p-3 rounded-xl text-sm border border-red-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {error.toString()}
                </motion.div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">User ID</label>
                    <input
                        type="number"
                        className="input-field bg-gray-50 cursor-not-allowed"
                        placeholder="Logged in User ID"
                        value={userId || ''} // FIX: Display context userId
                        disabled
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Meal Name</label>
                    <input
                        className="input-field"
                        placeholder="Breakfast, Lunch, Snack..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-dark mb-1">Calories Consumed</label>
                    <input
                        type="number"
                        step="0.1"
                        className="input-field"
                        placeholder="e.g., 550"
                        value={calories}
                        onChange={e => setCalories(e.target.value)}
                    />
                </div>
            </div>
            <button
                className="w-full btn-primary"
                onClick={handleSubmit}
                disabled={loading || !isAuthenticated || !userId} // FIX: Disable if not logged in
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Logging Meal...
                    </span>
                ) : (
                    "Log Meal"
                )}
            </button>
        </div>
    );
};

export default AddMeal;