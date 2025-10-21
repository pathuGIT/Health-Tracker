// src/components/AddExercise.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import api from '../services/Api';
import { logExercise } from "../services/ExerciseService"; // Import the log function

const AddExercise = ({ onExerciseAdded }) => {
    const [userId, setUserId] = useState("1"); 
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [calories, setCalories] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleSubmit = () => {
        setError(null);
        setLoading(true);

        // FIX: Use the imported logExercise service function 
        // (which correctly uses the plural '/api/exercises' path)
        logExercise({
            userId: parseInt(userId),
            exerciseName: name,
            durationMinutes: parseInt(duration),
            caloriesBurned: parseFloat(calories)
        })
            .then(res => {
                alert("Exercise logged successfully!");
                onExerciseAdded();
                // Clear form
                setName("");
                setDuration("");
                setCalories("");
            })
            .catch(err => {
                console.error(err);
                // Enhanced error message extraction
                const errorMessage = err.response?.data?.message || "Error logging exercise. Check if User ID exists and server is running.";
                setError(errorMessage);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="p-2 space-y-6">
            <p className="text-text-muted">
                Log a new workout session to track your progress and calories burned.
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
                        placeholder="Enter user ID"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        disabled
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Exercise Name</label>
                    <input
                        className="input-field"
                        placeholder="Running, Weights, Yoga..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Duration (minutes)</label>
                    <input
                        type="number"
                        className="input-field"
                        placeholder="e.g., 30"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Calories Burned</label>
                    <input
                        type="number"
                        step="0.1"
                        className="input-field"
                        placeholder="e.g., 350"
                        value={calories}
                        onChange={e => setCalories(e.target.value)}
                    />
                </div>
            </div>
            <button
                className="w-full btn-accent"
                onClick={handleSubmit}
                disabled={loading}
            >
                 {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Logging Exercise...
                    </span>
                ) : (
                    "Log Exercise"
                )}
            </button>
        </div>
    );
};

export default AddExercise;
