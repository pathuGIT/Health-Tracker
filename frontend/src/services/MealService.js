import api from './Api';

// Meal Endpoints (/api/meals)

/**
 * Logs a new meal and its calorie count.
 * @param {object} mealData - { userId, mealName, caloriesConsumed }
 */
export const logMeal = (mealData) => {
    return api.post('/meals', mealData); // FIX: Changed '/meal' to '/meals'
};

/**
 * Gets all meals for a specific user.
 * @param {number} userId
 */
export const getMealsByUser = (userId) => {
    console.log("Fetching meals for userId:", userId);
    // FIX: Changed API path from /meal/users/{userId} to /meals/user/{userId}
    return api.get(`/meals/user/${userId}`);
};

/**
 * Gets meals for a specific user on a specific date.
 * @param {number} userId
 * @param {string} date - Date in YYYY-MM-DD format.
 */
export const getMealsByUserAndDate = (userId, date) => {
    // FIX: Changed API path
    return api.get(`/meals/user/${userId}/date/${date}`);
};

/**
 * Gets total calories consumed for a user on a specific date (uses MySQL Stored Procedure).
 * @param {number} userId
 * @param {string} date - Date in YYYY-MM-DD format.
 */
export const getTotalCaloriesConsumed = (userId, date) => {
    // FIX: Changed API path
    return api.get(`/meals/user/${userId}/date/${date}/calories-consumed`);
};

/**
 * Gets the daily calorie intake summary (uses MySQL VIEW: daily_calorie_intake).
 * @param {number} userId
 * @param {string} date - Date in YYYY-MM-DD format.
 */
export const getDailyCalorieIntake = (userId, date) => {
    // FIX: Changed API path
    return api.get(`/meals/user/${userId}/date/${date}/summary`);
};
