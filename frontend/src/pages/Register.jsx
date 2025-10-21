// src/pages/Register.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { registerUser } from "../services/AuthService";

const Register = ({ switchToLogin }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    // ADDED STATE FOR NEW FIELDS
    const [contact, setContact] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            // UPDATED: Sending all collected fields instead of mock values
            await registerUser({ 
                name, 
                email, 
                password,
                contact,
                age: parseInt(age),
                weight: parseFloat(weight),
                height: parseFloat(height) 
            }); 
            
            setSuccess("Registration successful! Please log in.");
            // Clear form
            setName("");
            setEmail("");
            setPassword("");
            setContact("");
            setAge("");
            setWeight("");
            setHeight("");

            // Automatically switch to login after a brief success message
            setTimeout(switchToLogin, 1500);

        } catch (err) {
            console.error(err);
            let errorMessage = "Registration failed. Please check server status and try again.";

            if (err.response && err.response.data) {
                const errorData = err.response.data;
                // Check for nested error message structure from ApiResponse
                if (errorData.message) {
                    // Check if it's a list of errors
                    if (Array.isArray(errorData.data)) {
                        errorMessage = errorData.data.join(', ');
                    } else {
                        errorMessage = errorData.message;
                    }
                } else if (typeof errorData === 'object' && errorData !== null) {
                    errorMessage = errorData.error || errorMessage;
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-2">
            <p className="text-text-muted mb-6 text-center">
                Fill in your details to create an account and start your fitness journey.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-dark mb-1">Name</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Enter your name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-dark mb-1">Email</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="Enter email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-dark mb-1">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Enter password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="md:col-span-2">
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
                </div>
                
                <hr className="my-4 border-gray-100" />
                
                {/* Health Metrics */}
                <h3 className="text-lg font-semibold text-text-dark">Initial Health Data</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Age</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="Age"
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
                            placeholder="Weight in kg"
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                            required
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Height (cm)</label>
                        <input
                            type="number"
                            step="0.1"
                            className="input-field"
                            placeholder="Height in cm"
                            value={height}
                            onChange={e => setHeight(e.target.value)}
                            required
                            min="1"
                        />
                    </div>
                </div>

                {/* Error/Success Messages */}
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

                <button
                    type="submit"
                    className="w-full btn-accent mt-6"
                    disabled={loading || !!success}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Registering...
                        </span>
                    ) : (
                        "Register"
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={switchToLogin} 
                    className="text-sm text-primary-blue hover:text-primary-hover transition-colors font-medium"
                >
                    Already have an account? Login here.
                </button>
            </div>
        </div>
    );
};

export default Register;
