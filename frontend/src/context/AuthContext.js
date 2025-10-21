import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { loginUser, logoutUser } from '../services/AuthService';
import { getUserProfile } from '../services/UserService';

// Create the Context
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// Utility function to get DEMO_USER_ID if token exists
const getDemoUserId = () => (localStorage.getItem('token') ? 1 : null);

export const AuthProvider = ({ children }) => {
    // Initial state derived from localStorage token
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null); // Stores { id, name, email, ... }
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const fetchUserProfile = useCallback(async (userId) => {
        try {
            const res = await getUserProfile(userId);
            console.log("Fetched user profile:", userId);
            // Assuming getUserProfile returns ApiResponse<Map<String, Object>>
            const profileData = res.data.data || res.data;
            setUser({
                id: profileData.userId,
                name: profileData.name,
                email: profileData.email,
                // Include other relevant profile data
            });
        } catch (error) {
            console.error("Failed to fetch user profile after login:", error);
            // If profile fetch fails, treat it as a critical error (e.g., token invalid, user missing)
            handleLogout();
        } finally {
            setIsAuthLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authToken) {
            // After page load/refresh, load user data if a token is present
            const userId = getDemoUserId();
            if (userId) {
                fetchUserProfile(userId);
            } else {
                 // Should not happen if token exists, but ensures loading state is resolved
                setIsAuthLoading(false); 
            }
        } else {
            // No token, no user, done loading auth state
            setUser(null);
            setIsAuthLoading(false);
        }
    }, [authToken, fetchUserProfile]);


    const handleLogin = async (email, password) => {
        setIsAuthLoading(true);
        try {
            const res = await loginUser(email, password);
            const token = res.data?.data?.accessToken;

            if (token) {
                localStorage.setItem('token', token);
                setAuthToken(token);
                // Immediately trigger profile fetch using the known DEMO ID
                await fetchUserProfile(getDemoUserId()); 
                return true;
            }
        } catch (error) {
            setIsAuthLoading(false);
            throw error; // Let the Login component handle the error display
        }
    };

    const handleLogout = () => {
        logoutUser()
            .catch(err => console.error("Logout API failed (token likely invalid already):", err))
            .finally(() => {
                localStorage.removeItem('token');
                setAuthToken(null);
                setUser(null);
                setIsAuthLoading(false);
            });
    };

    const contextValue = {
        authToken,
        user,
        userId: user ? user.id : null, // Easier access to ID
        isAuthenticated: !!authToken,
        isAuthLoading,
        handleLogin,
        handleLogout,
        fetchUserProfile
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
