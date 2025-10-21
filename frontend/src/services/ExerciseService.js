import api from './Api';

// Exercise Endpoints (/api/exercises)

/**
 * Logs a new exercise session.
 * @param {object} exerciseData - { userId, exerciseName, durationMinutes, caloriesBurned }
 */
export const logExercise = (exerciseData) => {
    // FIX: Changed to plural /exercises to match controller mapping
    return api.post('/exercises', exerciseData);
};

/**
 * Gets all exercise sessions for a specific user.
 * @param {number} userId
 */
export const getExercisesByUser = (userId) => {
    // FIX: Changed API path to use plural base path /exercises
    return api.get(`/exercises/user/${userId}`);
};

/**
 * Gets exercise sessions for a specific user on a specific date.
 * @param {number} userId
 * @param {string} date - Date in YYYY-MM-DD format.
 */
export const getExercisesByUserAndDate = (userId, date) => {
    // FIX: Changed API path to use plural base path /exercises
    return api.get(`/exercises/user/${userId}/date/${date}`);
};

/**
 * Gets total calories burned for a user on a specific date (uses MySQL Stored Procedure).
 * @param {number} userId
 * @param {string} date - Date in YYYY-MM-DD format.
 */
export const getTotalCaloriesBurned = (userId, date) => {
    // FIX: Changed API path to use plural base path /exercises
    return api.get(`/exercises/user/${userId}/date/${date}/calories-burned`);
};

/**
 * Gets the daily exercise summary (uses MySQL VIEW: daily_exercise_summary).
 * @param {number} userId
 * @param {string} date - Date in YYYY-MM-DD format.
 */
export const getDailyExerciseSummary = (userId, date) => {
    // FIX: Changed API path to use plural base path /exercises
    return api.get(`/exercises/user/${userId}/date/${date}/summary`);
};
