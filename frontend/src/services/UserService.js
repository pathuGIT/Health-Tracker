import api from './Api';

// User Endpoints (/api/users)

/**
 * Fetches all user records (assuming admin-like privileges or unauthenticated for demo).
 */
export const getAllUsers = () => {
    return api.get('/users');
};

/**
 * Fetches a single user's basic details.
 * @param {number} userId
 */
export const getUserById = (userId) => {
    return api.get(`/users/${userId}`);
};

/**
 * Updates a user's profile information.
 * @param {number} userId
 * @param {object} usersDetails - Updated user data.
 */
export const updateUser = (userId, usersDetails) => {
    return api.put(`/users/${userId}`, usersDetails);
};

/**
 * Fetches the user profile summary (uses MySQL VIEW: user_profile_view).
 * @param {number} userId
 */
export const getUserProfile = (userId) => {
    return api.get(`/users/${userId}/profile`);
};

/**
 * Calculates BMI (uses MySQL Stored Procedure: CalculateUserBMI).
 * @param {number} userId
 */
export const calculateBMI = (userId) => {
    return api.get(`/users/${userId}/bmi`);
};

/**
 * Gets daily calorie status summary (uses MySQL UDF: get_user_calorie_summary).
 * @param {number} userId
 */
export const getCalorieSummary = (userId) => {
    return api.get(`/users/${userId}/calorie-summary`);
};

