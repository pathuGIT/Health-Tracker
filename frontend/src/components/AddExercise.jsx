import axios from "axios";
import { useState } from "react";

export default function AddExercise({ onExerciseAdded }) {
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
        <div>
            <h2>Add Exercise</h2>
            <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
            <input placeholder="Exercise Name" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Duration (min)" value={duration} onChange={e => setDuration(e.target.value)} />
            <input placeholder="Calories Burned" value={calories} onChange={e => setCalories(e.target.value)} />
            <button onClick={handleSubmit}>Log Exercise</button>
        </div>
    );
}