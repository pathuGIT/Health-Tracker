
import axios from "axios";
import { useState } from "react";

export default function AddUser() {
    const [name,setName]=useState(""); const [email,setEmail]=useState("");
    const [age,setAge]=useState(""); const [weight,setWeight]=useState("");
    const [height,setHeight]=useState("");

    const handleSubmit=()=>{
        axios.post("http://localhost:8080/api/users",{name,email,age,weight,height})
            .then(res=>alert(res.data))
            .catch(err=>alert(err));
    };

    return (
        <div>
            <h2>Add User</h2>
            <input placeholder="Name" onChange={e=>setName(e.target.value)} />
            <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
            <input placeholder="Age" onChange={e=>setAge(e.target.value)} />
            <input placeholder="Weight" onChange={e=>setWeight(e.target.value)} />
            <input placeholder="Height" onChange={e=>setHeight(e.target.value)} />
            <button onClick={handleSubmit}>Add User</button>
        </div>
    );
}
