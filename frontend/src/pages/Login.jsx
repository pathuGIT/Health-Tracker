// src/pages/Login.jsx
import { useState } from "react";
import { loginUser } from "../services/AuthService";

const Login = ({ onLoginSuccess, switchToRegister }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await loginUser(email, password);
            alert("Login Successful! Token stored in localStorage (mock JWT).");
            
            // Call the success handler in App.js to update the application state
            onLoginSuccess(res.data.token); 
        } catch (err) {
            console.error(err);
            // Display a user-friendly error message
            setError(err.response?.data || "Login failed. Check your credentials and server status.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-2xl p-8 transform hover:scale-[1.01] transition duration-300">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">User Login</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                        placeholder="Enter password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                {error && (
                    <div className="text-red-600 bg-red-100 p-3 rounded-lg text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md transform hover:shadow-lg"
                >
                    Log In
                </button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={switchToRegister} 
                    className="text-sm text-indigo-500 hover:text-indigo-700 transition-colors"
                >
                    Don't have an account? Register here.
                </button>
            </div>
        </div>
    );
};

export default Login;