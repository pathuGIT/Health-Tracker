// src/components/AddMeal.jsx
import axios from "axios";
import { useState } from "react";

const AddMeal = ({ onMealAdded }) => {
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [calories, setCalories] = useState("");

    const handleSubmit = () => {
        axios.post("http://localhost:8080/api/meal", {
            userId: parseInt(userId),
            mealName: name,
            caloriesConsumed: parseFloat(calories)
        })
            .then(res => {
                alert("Meal logged successfully!");
                onMealAdded();
                // Clear form
                setUserId("");
                setName("");
                setCalories("");
            })
            .catch(err => {
                console.error(err);
                alert("Error logging meal");
            });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Meal</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter meal name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter calories"
                        value={calories}
                        onChange={e => setCalories(e.target.value)}
                    />
                </div>
            </div>
            <button
                className="mt-6 px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                onClick={handleSubmit}
            >
                Log Meal
            </button>
        </div>
    );
};

export default AddMeal;