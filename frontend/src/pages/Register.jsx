// src/pages/Register.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { registerUser } from "../services/AuthService";

const Register = ({ switchToLogin }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            // Mock default values for User entity completeness
            await registerUser({ 
                name, 
                email, 
                age: 25, 
                weight: 70.0,
                height: 175.0 
            }); 
            
            setSuccess("Registration successful! Please log in.");
            // Clear form
            setName("");
            setEmail("");
            setPassword("");

            // Automatically switch to login after a brief success message
            setTimeout(switchToLogin, 1500);

        } catch (err) {
            console.error(err);
            let errorMessage = "Registration failed. Please check server status and try again.";

            if (err.response && err.response.data) {
                const errorData = err.response.data;
                if (typeof errorData === 'object' && errorData !== null) {
                    errorMessage = errorData.message || errorData.error || errorMessage;
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
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
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
                <div>
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
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Password</label>
                    <input
                        type="password"
                        className="input-field"
                        placeholder="Enter password (for mock only)"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                
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
                    className="w-full btn-accent"
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