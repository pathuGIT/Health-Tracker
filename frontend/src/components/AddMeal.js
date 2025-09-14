import axios from "axios";
import { useState } from "react";

export default function AddMeal() {
    const [userId,setUserId]=useState(""); const [name,setName]=useState("");
    const [calories,setCalories]=useState("");

    const handleSubmit=()=>{
        axios.post("http://localhost:8080/api/meal",
            {userId,mealName:name,caloriesConsumed:calories})
            .then(res=>alert(res.data))
            .catch(err=>alert(err));
    };

    return (
        <div>
            <h2>Add Meal</h2>
            <input placeholder="User ID" onChange={e=>setUserId(e.target.value)} />
            <input placeholder="Meal Name" onChange={e=>setName(e.target.value)} />
            <input placeholder="Calories" onChange={e=>setCalories(e.target.value)} />
            <button onClick={handleSubmit}>Log Meal</button>
        </div>
    );
}
