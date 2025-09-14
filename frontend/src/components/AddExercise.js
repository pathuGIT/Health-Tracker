import axios from "axios";
import { useState } from "react";

export default function AddExercise() {
    const [userId,setUserId]=useState(""); const [name,setName]=useState("");
    const [duration,setDuration]=useState(""); const [calories,setCalories]=useState("");

    const handleSubmit=()=>{
        axios.post("http://localhost:8080/api/exercise",
            {userId,exerciseName:name,durationMinutes:duration,caloriesBurned:calories})
            .then(res=>alert(res.data))
            .catch(err=>alert(err));
    };

    return (
        <div>
            <h2>Add Exercise</h2>
            <input placeholder="User ID" onChange={e=>setUserId(e.target.value)} />
            <input placeholder="Exercise Name" onChange={e=>setName(e.target.value)} />
            <input placeholder="Duration (min)" onChange={e=>setDuration(e.target.value)} />
            <input placeholder="Calories Burned" onChange={e=>setCalories(e.target.value)} />
            <button onClick={handleSubmit}>Log Exercise</button>
        </div>
    );
}
