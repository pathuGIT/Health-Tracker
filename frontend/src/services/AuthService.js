import api from './Api';

// Authentication Endpoints (Now using /api/auth for Spring Security implementation)

/**
 * Registers a new user.
 * @param {object} userData - User details including name, email, contact, password, age, weight, height.
 */
export const registerUser = (userData) => {
    // FIX: Change endpoint to the secure AuthController endpoint.
    return api.post('/auth/register', userData);
};

/**
 * Logs in a user.
 * @param {string} email - User's email (used as login identifier for this demo).
 * @param {string} password - User's password.
 */
export const loginUser = (email, password) => {
    // FIX: Change endpoint to the secure AuthController endpoint and map email to 'login'
    // to match the backend LoginRequest DTO.
    return api.post('/auth/login', { login: email, password }) 
        .then(res => {
            // FIX: The AuthController returns ApiResponse<TokenResponse>, so data is nested.
            const tokenResponse = res.data.data;
            if (tokenResponse && tokenResponse.accessToken) {
                // Save the access token to localStorage, which the API interceptor uses.
                localStorage.setItem("token", tokenResponse.accessToken); 
            }
            return res; // Return the full response
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
    // FIX: Change endpoint to the secure AuthController endpoint.
    return api.put('/auth/logout');
};
