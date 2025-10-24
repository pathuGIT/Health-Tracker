// src/pages/AlertsPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getAlertsByUser, markAlertAsRead } from "../services/AlertService"; 

const AlertsPage = () => {
    const { userId, isAuthenticated, isAuthLoading } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAlerts = useCallback(async () => {
        if (!isAuthenticated || !userId) {
            setError("Authentication required to view alerts.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await getAlertsByUser(userId); 
            // Response format is assumed to be raw list of alerts
            setAlerts(response.data);
        } catch (err) {
            console.error("Error fetching alerts:", err);
            setError("Failed to fetch alerts. Check server status.");
        } finally {
            setLoading(false);
        }
    }, [userId, isAuthenticated]);

    useEffect(() => {
        if (!isAuthLoading) {
            fetchAlerts();
        }
    }, [isAuthLoading, fetchAlerts]);

    const handleMarkAsRead = async (alertId) => {
        try {
            await markAlertAsRead(alertId);
            // Optimistically update the local state
            setAlerts(prevAlerts => 
                prevAlerts.map(alert => 
                    alert.alertId === alertId ? { ...alert, isRead: true } : alert
                )
            );
        } catch (err) {
            console.error("Failed to mark alert as read:", err);
            alert("Failed to mark alert as read.");
        }
    };
    
    // UI Render Logic
    if (loading) {
        return (
            <div className="card text-center py-12">
                <p className="text-text-muted">Loading alerts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card text-center py-12 bg-red-50 border-red-200">
                <p className="text-accent-red">⚠️ {error}</p>
            </div>
        );
    }

    const unreadCount = alerts.filter(a => !a.isRead).length;

    return (
        <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h1 className="text-3xl font-bold text-text-dark">Notifications & Alerts</h1>
            <p className="text-text-muted">You have {unreadCount} unread alerts, mostly for exceeding the daily calorie limit (2500 kcal).</p>
            
            {alerts.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="text-6xl mb-4">🔔</div>
                    <h3 className="text-xl font-semibold text-text-dark mb-2">No Alerts Found</h3>
                    <p className="text-text-muted">Your alert log is clean.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {alerts.map((alert, index) => (
                        <motion.div
                            key={alert.alertId}
                            className={`card p-4 flex justify-between items-center ${!alert.isRead ? 'bg-yellow-50 border-yellow-200 shadow-lg' : 'bg-white border-gray-100'}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div>
                                <p className={`font-semibold ${!alert.isRead ? 'text-text-dark' : 'text-text-muted'}`}>
                                    {alert.isRead ? '✅' : '🔔'} {alert.message}
                                </p>
                                <p className="text-xs text-text-muted mt-1">
                                    {new Date(alert.alertDate).toLocaleString()}
                                </p>
                            </div>
                            {!alert.isRead && (
                                <button
                                    onClick={() => handleMarkAsRead(alert.alertId)}
                                    className="px-3 py-1 bg-primary-blue text-white rounded-xl text-sm hover:bg-primary-hover transition-colors font-medium"
                                >
                                    Mark as Read
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default AlertsPage;