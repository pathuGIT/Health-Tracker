// src/components/AddUser.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import api from '../services/Api';

const AddUser = ({ onUserAdded }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = () => {
        setError(null);
        setLoading(true);

        api.post("/users", {
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
                setError(err.response?.data || "Error adding user");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="p-2 space-y-6">
            <p className="text-text-muted">
                Quickly add a new user profile to the database.
            </p>
            {error && (
                <motion.div 
                    className="text-accent-red bg-red-100 p-3 rounded-xl text-sm border border-red-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {error.toString()}
                </motion.div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Name</label>
                    <input
                        className="input-field"
                        placeholder="Enter name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Email</label>
                    <input
                        type="email"
                        className="input-field"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Age</label>
                    <input
                        type="number"
                        className="input-field"
                        placeholder="Enter age"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Weight (kg)</label>
                    <input
                        type="number"
                        step="0.1"
                        className="input-field"
                        placeholder="Enter weight"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-dark mb-1">Height (cm)</label>
                    <input
                        type="number"
                        step="0.1"
                        className="input-field"
                        placeholder="Enter height"
                        value={height}
                        onChange={e => setHeight(e.target.value)}
                    />
                </div>
            </div>
            <button
                className="w-full btn-primary"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Adding User...
                    </span>
                ) : (
                    "Add User"
                )}
            </button>
        </div>
    );
};

export default AddUser;