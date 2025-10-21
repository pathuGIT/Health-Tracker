import api from './Api';

// Health Metric Endpoints (/api/metric)

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
    return api.get(`/metric/user/${userId}`);
};

/**
 * Gets the latest recorded health metric for a user.
 * @param {number} userId
 */
export const getLatestHealthMetric = (userId) => {
    return api.get(`/metric/user/${userId}/latest`);
};

/**
 * Gets the user's weight and BMI progress over time (uses MySQL VIEW: health_progress_view).
 * @param {number} userId
 */
export const getHealthProgress = (userId) => {
    return api.get(`/metric/user/${userId}/progress`);
};