import { useEffect, useState } from "react";
import axios from "axios"; // Keep axios for the error log if needed, but switch to the service
import { getExercisesByUser } from "../services/ExerciseService"; // FIX: Import service

// NOTE: This file appears to be a duplicate or outdated version of src/components/Exercises.jsx
// It should ideally use the centralized component's logic or be removed.
// For now, we fix it to use the secure service method.

const DEMO_USER_ID = 1; // Assuming this user ID logic is handled by the overall app context

const Exercises = () => {
    const [exercises, setExercises] = useState([]);
    // State for handling loading/errors, added for robustness
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // FIX: Use the secure service method instead of direct axios call to the wrong endpoint
        const fetchExercises = async () => {
            try {
                setLoading(true);
                const res = await getExercisesByUser(DEMO_USER_ID);
                setExercises(res.data.data?.exercises || res.data.data || res.data.exercises || res.data || []);
            } catch (err) {
                 console.error("Error fetching exercises:", err);
                 if (err.response && err.response.status === 403) {
                     setError("Forbidden: Authentication required or invalid privileges. Please log in.");
                 } else {
                     setError("Failed to fetch exercises: " + (err.message || "An unknown error occurred."));
                 }
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, []);

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
                {exercises.length === 0 && <p className="text-gray-500">No exercises logged yet.</p>}
            </div>
        </div>
    );
};

export default Exercises;
