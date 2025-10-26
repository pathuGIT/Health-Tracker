import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { loginUser, logoutUser } from '../services/AuthService';
import { getUserProfile } from '../services/UserService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const handleLogout = useCallback(() => {
        logoutUser()
            .catch(err => console.error("Logout API failed:", err))
            .finally(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userRole');
                localStorage.removeItem('refreshToken'); // ✅ Don't forget to clear refresh token
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
                weight: profileData.currentWeight,
                // FIX: Store BMI fetched from the server's user profile view
                bmi: profileData.lastBMIRecorded 
            });
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            // Only logout if it's an authentication error (403/401)
            if (error.response?.status === 403 || error.response?.status === 401) {
                handleLogout();
            }
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
            const authenticatedUserRole = tokenResponse?.role;
            const refreshToken = tokenResponse?.refreshToken;

            console.log("Login successful for user ID:", authenticatedUserId);

            if (token && authenticatedUserId && authenticatedUserRole && refreshToken) {
                localStorage.setItem('token', token);
                localStorage.setItem('userId', authenticatedUserId.toString());
                localStorage.setItem('userRole', authenticatedUserRole);
                localStorage.setItem('refreshToken', refreshToken);
                setAuthToken(token);
                setUserRole(authenticatedUserRole);
                await fetchUserProfile(authenticatedUserId); 
                return true;
            } else {
                throw new Error("Authentication succeeded but missing required data in response.");
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
        userRole,
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