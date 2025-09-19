import axios from "axios";
import { useState } from "react";

export default function AddMeal({ onMealAdded }) {
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
        <div>
            <h2>Add Meal</h2>
            <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
            <input placeholder="Meal Name" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Calories" value={calories} onChange={e => setCalories(e.target.value)} />
            <button onClick={handleSubmit}>Log Meal</button>
        </div>
    );
}