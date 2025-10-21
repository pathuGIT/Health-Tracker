// src/pages/Exercises.jsx
import { useEffect, useState } from "react";
// Removed unused import: axios
import { getExercisesByUser } from "../services/ExerciseService";
import { useAuth } from "../context/AuthContext"; // NEW IMPORT: Use AuthContext

// NOTE: This file appears to be a duplicate or outdated version of src/components/Exercises.jsx
// It should ideally use the centralized component's logic or be removed.
// We fix it to use the secure service method and dynamically determine the user ID.

const Exercises = () => {
    // FIX: Get userId from context instead of localStorage placeholder
    const { userId } = useAuth(); 
    
    const [exercises, setExercises] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Removed old placeholder: const userId = localStorage.getItem('token') ? 1 : null; 

    useEffect(() => {
        const fetchExercises = async () => {
            if (!userId) {
                // Now relying on the context for authentication status
                setError("Authentication required to view exercises. Please log in.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // FIX: Use the dynamically determined userId
                const res = await getExercisesByUser(userId); 
                // Assuming response data structure might be nested
                const data = res.data.data?.exercises || res.data.data || res.data.exercises || res.data || [];
                setExercises(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                 console.error("Error fetching exercises:", err);
                 if (err.response && err.response.status === 403) {
                     setError("Forbidden: Invalid privileges or token expired. Please log in again.");
                 } else {
                     setError("Failed to fetch exercises: " + (err.message || "An unknown error occurred."));
                 }
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, [userId]); // Depend on userId to re-fetch after login/logout

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading exercises...</div>;
    }

    if (error) {
         return <div className="p-6 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Exercises</h2>
            <div className="space-y-4">
                {exercises.map(exercise => (
                    <div key={exercise.exerciseId} className="bg-green-50 p-5 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="font-semibold text-lg">{exercise.exerciseName}</h3>
                        <p>User ID: {exercise.userId}</p>
                        <p>Duration: {exercise.durationMinutes} mins</p>
                        <p>Calories burned: {exercise.caloriesBurned}</p>
                    </div>
                ))}
                {exercises.length === 0 && <p className="text-gray-500">No exercises logged yet for User ID {userId}.</p>}
            </div>
        </div>
    );
};

export default Exercises;
