// frontend/src/components/Exercises.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getExercisesByUser } from "../services/ExerciseService";
import { useAuth } from "../context/AuthContext"; // 1. FIX: Import useAuth

// REMOVED: const DEMO_USER_ID = 1;

const Exercises = () => {
    console.log('Exercises component mounting'); 
    
    // 2. FIX: Get userId, isAuthenticated, and isAuthLoading from context
    const { userId, isAuthenticated, isAuthLoading } = useAuth();

    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExercises = async () => {
             // 3. FIX: Wait until Auth process is finished
             if (isAuthLoading) {
                setLoading(true); 
                return;
            }

            // 4. FIX: Check if authenticated before fetching
            if (!isAuthenticated || !userId) {
                setError("Authentication required to view exercises. Please log in.");
                setLoading(false);
                setExercises([]);
                return;
            }

            // 5. We have a stable, valid userId: fetch data.
            try {
                setLoading(true);
                setError(null);

                // 6. FIX: Use the actual userId from context
                const response = await getExercisesByUser(userId); 
                const exercisesData = response?.data?.exercises || response?.data?.data || response?.data || [];
                
                setExercises(Array.isArray(exercisesData) ? exercisesData : []);

            } catch (err) {
                console.error("Error fetching exercises:", err);
                if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNREFUSED') {
                    setError("Cannot connect to server. Make sure the backend is running on port 8080.");
                } else if (err.response) {
                    setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
                } else if (err.request) {
                    setError("No response from server. Check if the server is running.");
                } else {
                    setError("Failed to fetch exercises: " + err.message);
                }
                setExercises([]);
            } finally {
                setLoading(false);
            }
        };

        // 7. Depend on all relevant auth states
        fetchExercises();
    }, [userId, isAuthenticated, isAuthLoading]); 

    if (loading) {
        return (
            <div className="card text-center py-12">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-accent-green border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-text-muted">Loading workout log...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <div className="text-accent-red text-4xl mb-4">⚠️</div>
                    <h3 className="text-text-dark font-semibold text-lg mb-2">Error Loading Exercises</h3>
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
                    {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'} logged for User ID {userId}. 
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-100 text-text-dark rounded-xl hover:bg-gray-200 transition-colors font-semibold text-sm"
                >
                    Refresh
                </button>
            </div>

            {exercises.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="text-6xl mb-4">💪</div>
                    <h3 className="text-xl font-semibold text-text-dark mb-2">No Exercises Found</h3>
                    <p className="text-text-muted">No exercises have been logged for this user yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {exercises.map((exercise, index) => (
                        <motion.div
                            key={exercise.exerciseId}
                            className="card bg-green-50 border-green-100"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-xl text-accent-green">
                                        {exercise.exerciseName}
                                    </h3>
                                    <p className="text-text-muted text-sm mt-1">User ID: {exercise.userId}</p> 
                                </div>
                                <div className="w-12 h-12 bg-accent-green rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    🏋️
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-white px-4 py-3 rounded-xl text-center shadow-sm">
                                    <p className="text-accent-green font-bold text-2xl">{exercise.durationMinutes}</p>
                                    <p className="text-text-muted text-sm">Minutes</p>
                                </div>
                                <div className="bg-white px-4 py-3 rounded-xl text-center shadow-sm">
                                    <p className="text-accent-red font-bold text-2xl">{exercise.caloriesBurned}</p>
                                    <p className="text-text-muted text-sm">Calories Burned</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center text-xs text-text-muted">
                                    <span>ID: {exercise.exerciseId}</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded-lg">
                                        {exercise.date ? new Date(exercise.date).toLocaleDateString() : 'Unknown Date'}
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

export default Exercises;