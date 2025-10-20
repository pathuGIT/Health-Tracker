import api from './Api';

// Authentication Endpoints (Now using /api/users for demo simplicity)

/**
 * Registers a new user.
 * @param {object} userData - User details including name, email, contact, password, age, weight, height.
 */
export const registerUser = (userData) => {
    return api.post('/users/register', userData);
};

/**
 * Logs in a user.
 * @param {string} email - User's email (used as login identifier for this demo).
 * @param {string} password - User's password.
 */
export const loginUser = (email, password) => {
    // Passes email and a mock password in the body. The backend is only using email for the mock check.
    return api.post('/users/login', { email, password }) 
        .then(res => {
            if (res.data && res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
            return res;
        });
};

/**
 * Gets a new access token using the refresh token.
 * @param {string} refreshToken - The expired refresh token.
 */
export const refreshToken = (refreshToken) => {
    return api.post('/auth/refresh-token', { refreshToken });
};

/**
 * Logs out the current user, invalidating the refresh token on the server.
 */
export const logoutUser = () => {
    return api.put('/auth/logout');
};