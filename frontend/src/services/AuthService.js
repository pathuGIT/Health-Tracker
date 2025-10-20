import api from './Api';

// Authentication Endpoints (/api/auth)

/**
 * Registers a new user.
 * @param {object} userData - User details including name, email, contact, password, age, weight, height.
 */
export const registerUser = (userData) => {
    return api.post('/auth/register', userData);
};

/**
 * Logs in a user.
 * @param {string} login - User's email or contact number.
 * @param {string} password - User's password.
 */
export const loginUser = (login, password) => {
    return api.post('/auth/login', { login, password })
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
