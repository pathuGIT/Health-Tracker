// src/pages/Register.jsx
import { useState } from "react";
import { registerUser } from "../services/AuthService";

const Register = ({ switchToLogin }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            // Provide mock/default values for age, weight, and height 
            // as required by the backend User entity fields.
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
        } catch (err) {
            console.error(err);
            let errorMessage = "Registration failed. Please check server status and try again.";

            if (err.response && err.response.data) {
                const errorData = err.response.data;
                // Safely extract message from Spring Boot error object (if present)
                if (typeof errorData === 'object' && errorData !== null) {
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-2xl p-8 transform hover:scale-[1.01] transition duration-300">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-teal-700">Register New User</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
                        placeholder="Enter your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
                        placeholder="Enter email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
                        placeholder="Enter password (for mock only)"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                {/* Fixed error display: error is now guaranteed to be a string */}
                {error && (
                    <div className="text-red-600 bg-red-100 p-3 rounded-lg text-sm border border-red-200">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="text-green-600 bg-green-100 p-3 rounded-lg text-sm border border-green-200">
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full px-4 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md transform hover:shadow-lg"
                >
                    Register
                </button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={switchToLogin} 
                    className="text-sm text-teal-500 hover:text-teal-700 transition-colors"
                >
                    Already have an account? Login here.
                </button>
            </div>
        </div>
    );
};

export default Register;