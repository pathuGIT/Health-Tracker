// frontend/src/components/Header.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const Header = ({ onTabChange, activeTab }) => {
    // Get auth state and actions from context
    const { authToken, handleLogout } = useAuth();
    const isLoggedOut = !authToken;
    const isLoginPage = activeTab === 'login';
    const isRegisterPage = activeTab === 'register';

    // The header is fixed to the top and spans the entire width.
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-card-white shadow-md">
            <div className="max-w-full mx-auto px-8 py-4 flex justify-between items-center">
                {/* Logo/Title - Button action navigates to dashboard */}
                <button 
                    onClick={() => onTabChange("dashboard")}
                    className="text-3xl font-bold text-primary-blue flex items-center hover:opacity-90 transition-opacity"
                >
                    <span className="text-accent-green mr-2 text-4xl">💚</span> FitTrack Pro
                </button>

                {/* Navigation/Actions */}
                <div className="flex space-x-4">
                    {isLoggedOut ? (
                        // Logged Out View: Show Login and Register buttons
                        <>
                            <button 
                                className={`text-lg font-semibold transition-colors ${isLoginPage ? 'text-primary-hover' : 'text-text-muted hover:text-primary-blue'}`}
                                onClick={() => onTabChange('login')}
                            >
                                Login
                            </button>
                            <button 
                                className={`text-lg font-semibold px-5 py-2 rounded-full shadow-md transition-all ${isRegisterPage ? 'bg-accent-green text-white hover:bg-green-600' : 'bg-primary-blue text-white hover:bg-primary-hover'}`}
                                onClick={() => onTabChange('register')}
                            >
                                Register
                            </button>
                        </>
                    ) : (
                        // Logged In View: Show Logout button
                        <button
                            className="text-lg font-semibold text-accent-red hover:text-red-700 transition-colors"
                            onClick={handleLogout}
                        >
                            Logout 🚪
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;