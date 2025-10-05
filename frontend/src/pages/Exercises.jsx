import { useEffect, useState } from "react";
import axios from "axios";

const Exercises = () => {
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/exercise")
            .then(res => setExercises(res.data))
            .catch(err => console.error("Error fetching Exercises.jsx:", err));
    }, []);

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
            </div>
        </div>
    );
};

export default Exercise;
