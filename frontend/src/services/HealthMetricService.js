// src/services/HealthMetricService.js
import api from './Api';

// Health Metric Endpoints (/api/health-metrics)

/**
 * Records a new health metric (typically weight).
 * The backend calculates BMI automatically.
 * @param {object} metricData - { userId, weight }
 */
export const recordHealthMetric = (metricData) => {
    console.log("Recording health metric for userId:", metricData.userId, "with weight:", metricData.weight);
    return api.post('/health-metrics', metricData);
};

/**
 * Gets all historical health metrics for a user.
 * @param {number} userId
 */
export const getHealthMetricsByUser = (userId) => {
    // FIX: Change API path to /health-metrics/user/
    return api.get(`/health-metrics/user/${userId}`);
};

/**
 * Gets the latest recorded health metric for a user.
 * @param {number} userId
 */
export const getLatestHealthMetric = (userId) => {
    // FIX: Change API path to /health-metrics/user/
    return api.get(`/health-metrics/user/${userId}/latest`);
};

/**
 * Gets the user's weight and BMI progress over time (uses MySQL VIEW: health_progress_view).
 * @param {number} userId
 */
export const getHealthProgress = (userId) => {
    // FIX: Change API path to /health-metrics/user/
    return api.get(`/health-metrics/user/${userId}/progress`);
};

/**
 * Gets the user's calories consumed vs. burned data (uses MySQL VIEW: calories_consumed_burned_view).
 * @param {number} userId
 */
export const getCaloriesConsumedBurned = (userId) => {
    // Make sure the endpoint matches your backend HealthMetricController
    return api.get(`/health-metrics/user/${userId}/calories_consumed_burned`);
};