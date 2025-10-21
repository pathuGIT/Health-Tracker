// src/pages/Login.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext"; // Import useAuth

const Login = ({ onLoginSuccess, switchToRegister }) => {
    // FIX: Get handleLogin from context
    const { handleLogin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // FIX: Use context handleLogin, which manages token storage, state update, and profile fetch
            const success = await handleLogin(email, password); 

            if (success) {
                alert("Login Successful! Redirecting to dashboard.");
                // Signal App.js for UI transition (modal close and tab set)
                onLoginSuccess(); 
            } else {
                 // handleLogin should throw on failure, but for explicit clarity
                 throw new Error("Authentication failed unexpectedly.");
            }

        } catch (err) {
            console.error(err);
            // FIX: Error handling to extract message from API response
            const apiMessage = err.response?.data?.message || err.response?.data?.data;
            const fallbackMessage = "Login failed. Check your credentials and server status.";
            
            setError(apiMessage || fallbackMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-2">
            <p className="text-text-muted mb-6 text-center">
                Enter your credentials to access your personalized dashboard.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                        placeholder="Enter password"
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

                <button
                    type="submit"
                    className="w-full btn-primary"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Logging In...
                        </span>
                    ) : (
                        "Log In"
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={switchToRegister} 
                    className="text-sm text-primary-blue hover:text-primary-hover transition-colors font-medium"
                >
                    Don't have an account? Register here.
                </button>
            </div>
        </div>
    );
};

export default Login;