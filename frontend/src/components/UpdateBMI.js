import axios from "axios";
import { useState } from "react";

export default function UpdateBMI() {
    const [userId,setUserId]=useState(""); const [weight,setWeight]=useState("");

    const handleSubmit=()=>{
        axios.post(`http://localhost:8080/api/bmi?userId=${userId}&weight=${weight}`)
            .then(res=>alert(res.data))
            .catch(err=>alert(err));
    };

    return (
        <div>
            <h2>Update BMI</h2>
            <input placeholder="User ID" onChange={e=>setUserId(e.target.value)} />
            <input placeholder="New Weight" onChange={e=>setWeight(e.target.value)} />
            <button onClick={handleSubmit}>Update BMI</button>
        </div>
    );
}
