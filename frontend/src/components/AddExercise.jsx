// src/components/AddExercise.jsx
import axios from "axios";
import { useState } from "react";

const AddExercise = ({ onExerciseAdded }) => {
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [calories, setCalories] = useState("");

    const handleSubmit = () => {
        axios.post("http://localhost:8080/api/exercise", {
            userId: parseInt(userId),
            exerciseName: name,
            durationMinutes: parseInt(duration),
            caloriesBurned: parseFloat(calories)
        })
            .then(res => {
                alert("Exercise logged successfully!");
                onExerciseAdded();
                // Clear form
                setUserId("");
                setName("");
                setDuration("");
                setCalories("");
            })
            .catch(err => {
                console.error(err);
                alert("Error logging exercise");
            });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Exercise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter user ID"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name</label>
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter exercise name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter duration"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calories Burned</label>
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter calories burned"
                        value={calories}
                        onChange={e => setCalories(e.target.value)}
                    />
                </div>
            </div>
            <button
                className="mt-6 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                onClick={handleSubmit}
            >
                Log Exercise
            </button>
        </div>
    );
};

export default AddExercise;