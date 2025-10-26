// frontend/src/components/AddUser.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { registerUser } from "../services/AuthService"; // CHANGED: Import registerUser from AuthService

const AddUser = ({ onUserAdded }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    // ADDED STATE FOR REQUIRED FIELDS
    const [password, setPassword] = useState("");
    const [contact, setContact] = useState("");

    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


    const handleSubmit = () => {
        setError(null);
        setSuccess(null);
        setLoading(true);

        // FIX: Use registerUser service (which hits /api/auth/register)
        registerUser({
            name,
            email,
            password, // ADDED
            contact, // ADDED
            age: parseInt(age),
            weight: parseFloat(weight),
            height: parseFloat(height)
        })
            .then(res => {
                setSuccess("User added successfully! They can now log in.");
                onUserAdded(); 
                
                // Clear form
                setName("");
                setEmail("");
                setPassword("");
                setContact("");
                setAge("");
                setWeight("");
                setHeight("");

            })
            .catch(err => {
                console.error(err);
                // Enhanced error message extraction for validation errors
                const errorMessage = err.response?.data?.message || err.response?.data?.data || "Error adding user (check logs).";
                setError(errorMessage);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="p-2 space-y-6">
            <p className="text-text-muted">
                Quickly register a new **User** profile. Contact and Password are required for user authentication.
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
            {success && (
                <motion.div 
                    className="text-accent-green bg-green-100 p-3 rounded-xl text-sm border border-green-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {success}
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
                        required
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
                        required
                    />
                </div>
                
                {/* NEW REQUIRED FIELD: Contact */}
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Contact</label>
                    <input
                        type="tel"
                        className="input-field"
                        placeholder="Enter contact number"
                        value={contact}
                        onChange={e => setContact(e.target.value)}
                        required
                    />
                </div>
                {/* NEW REQUIRED FIELD: Password */}
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Password</label>
                    <input
                        type="password"
                        className="input-field"
                        placeholder="Set initial password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                </div>
                {/* END NEW REQUIRED FIELDS */}

                <div className="md:col-span-2 border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-text-dark mb-2">Initial Health Data</h3>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Age</label>
                    <input
                        type="number"
                        className="input-field"
                        placeholder="Enter age"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        required
                        min="1"
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
                        required
                        min="1"
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
                        required
                        min="1"
                    />
                </div>
            </div>
            <button
                className="w-full btn-primary"
                onClick={handleSubmit}
                disabled={loading || !!success}
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Registering User...
                    </span>
                ) : (
                    "Register New User"
                )}
            </button>
        </div>
    );
};

export default AddUser;