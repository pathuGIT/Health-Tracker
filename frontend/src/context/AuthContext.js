// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { loginUser, logoutUser } from '../services/AuthService';
import { getUserProfile } from '../services/UserService';

// Create the Context
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Initial state derived from localStorage token
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null); // Stores { id, name, email, ... }
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // Helper to get logout function, ensuring it's available in dependencies
    const handleLogout = useCallback(() => {
        logoutUser()
            .catch(err => console.error("Logout API failed (token likely invalid already):", err))
            .finally(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userRole');
                setAuthToken(null);
                setUser(null);
                setUserRole(null);
                setIsAuthLoading(false);
            });
    }, []);

    const fetchUserProfile = useCallback(async (userId) => {
        try {
            const res = await getUserProfile(userId);
            console.log("Fetched user profile:", userId);
            const profileData = res.data.data || res.data;
            setUser({
                id: profileData.userId,
                name: profileData.name,
                email: profileData.email,
                age: profileData.age,
                height: profileData.height,
                weight: profileData.currentWeight
            });
        } catch (error) {
            console.error("Failed to fetch user profile after login:", error);
            handleLogout();
        } finally {
            setIsAuthLoading(false);
        }
    }, [handleLogout]);

    useEffect(() => {
        if (authToken) {
            const storedUserId = localStorage.getItem('userId');
            const storedUserRole = localStorage.getItem('userRole');
            if (storedUserId && storedUserRole) {
                setUserRole(storedUserRole);
                fetchUserProfile(parseInt(storedUserId));
            } else {
                setIsAuthLoading(false); 
                handleLogout();
            }
        } else {
            setUser(null);
            setUserRole(null);
            setIsAuthLoading(false);
        }
    }, [authToken, fetchUserProfile, handleLogout]);


    const handleLogin = async (email, password) => {
        setIsAuthLoading(true);
        try {
            const res = await loginUser(email, password);
            const tokenResponse = res.data?.data; 
            const token = tokenResponse?.accessToken;
            const authenticatedUserId = tokenResponse?.userId; 

            if (token && authenticatedUserId) {
                localStorage.setItem('token', token);
                localStorage.setItem('userId', authenticatedUserId.toString());
                setAuthToken(token);
                const mockRole = 'USER'; // Default to USER
                localStorage.setItem('userRole', mockRole);
                setUserRole(mockRole);
                await fetchUserProfile(authenticatedUserId); 
                return true;
            } else {
                throw new Error("Authentication succeeded but missing user ID or token in response.");
            }
        } catch (error) {
            setIsAuthLoading(false);
            throw error; 
        }
    };

    const contextValue = {
        authToken,
        user,
        userId: user ? user.id : null,
        isAuthenticated: !!authToken,
        isAuthLoading,
        userRole, // NEW: Expose user role
        isAdmin: userRole === 'ADMIN',
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