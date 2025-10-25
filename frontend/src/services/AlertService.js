import api from './Api';

// Alert Endpoints (/api/alerts)

/**
 * Fetches all alerts for a specific user.
 * @param {number} userId
 */
export const getAlertsByUser = (userId) => {
    return api.get(`/alerts/user/${userId}`);
};

/**
 * Fetches only unread alerts for a specific user.
 * @param {number} userId
 */
export const getUnreadAlertsByUser = (userId) => {
    return api.get(`/alerts/user/${userId}/unread`);
};

/**
 * Marks a specific alert as read.
 * @param {number} alertId
 */
export const markAlertAsRead = (alertId) => {
    return api.put(`/alerts/${alertId}/read`);
};