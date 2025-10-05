import { useEffect, useState } from "react";
import axios from "axios";

const Exercises = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get("http://localhost:8080/api/exercise", {
                    timeout: 10000,
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                console.log("Exercises API Response:", response);

                // Handle different response structures
                let exercisesData = response.data;

                if (exercisesData && exercisesData.data) {
                    exercisesData = exercisesData.data;
                }

                if (exercisesData && exercisesData.exercises) {
                    exercisesData = exercisesData.exercises;
                }

                if (Array.isArray(exercisesData)) {
                    setExercises(exercisesData);
                } else {
                    setError("Invalid data format received from server");
                }

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
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Exercises
                </h2>
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">Loading exercises...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Exercises
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <div className="text-red-500 text-4xl mb-4">💪</div>
                    <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Exercises</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Exercises
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'} logged
                    </p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                    Refresh
                </button>
            </div>

            {exercises.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">💪</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Exercises Found</h3>
                    <p className="text-gray-500">No exercises have been logged yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {exercises.map(exercise => (
                        <div
                            key={exercise.exerciseId}
                            className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-md border border-green-100 hover:shadow-lg transition-all duration-300 hover:border-green-200 group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-800 group-hover:text-green-700 transition-colors">
                                        {exercise.exerciseName}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">User ID: {exercise.userId}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    💪
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-green-100 px-4 py-3 rounded-lg">
                                    <p className="text-green-700 font-bold text-2xl">{exercise.durationMinutes}</p>
                                    <p className="text-green-600 text-sm">Minutes</p>
                                </div>
                                <div className="bg-red-100 px-4 py-3 rounded-lg">
                                    <p className="text-red-700 font-bold text-2xl">{exercise.caloriesBurned}</p>
                                    <p className="text-red-600 text-sm">Calories Burned</p>
                                </div>
                            </div>

                            {exercise.intensity && (
                                <div className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg">
                                    <span className="text-blue-700 text-sm font-medium">Intensity</span>
                                    <span className="text-blue-600 font-semibold capitalize">{exercise.intensity}</span>
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Exercise ID: {exercise.exerciseId}</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">Just now</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Exercises;