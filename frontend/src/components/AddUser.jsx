import axios from "axios";
import { useState } from "react";

export default function AddUser({ onUserAdded }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");

    const handleSubmit = () => {
        axios.post("http://localhost:8080/api/users", {
            name,
            email,
            age: parseInt(age),
            weight: parseFloat(weight),
            height: parseFloat(height)
        })
            .then(res => {
                alert("User added successfully!");
                onUserAdded();
                // Clear form
                setName("");
                setEmail("");
                setAge("");
                setWeight("");
                setHeight("");
            })
            .catch(err => {
                console.error(err);
                alert("Error adding user");
            });
    };

    return (
        <div>
            <h2>Add User</h2>
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
            <input placeholder="Weight" value={weight} onChange={e => setWeight(e.target.value)} />
            <input placeholder="Height" value={height} onChange={e => setHeight(e.target.value)} />
            <button onClick={handleSubmit}>Add User</button>
        </div>
    );
}