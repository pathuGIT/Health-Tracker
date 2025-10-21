// src/components/UpdateBMI.jsx
import { useState } from "react";
import { motion } from "framer-motion";
// REMOVED: import api from '../services/Api';
import { useAuth } from "../context/AuthContext"; 
// NEW IMPORT: Use the dedicated service function
import { recordHealthMetric } from "../services/HealthMetricService"; 

const UpdateBMI = ({ closeModal }) => {
    // FIX: Get userId, isAuthenticated, and fetchUserProfile from context
    const { userId, isAuthenticated, fetchUserProfile } = useAuth(); 

    // REMOVED local userId state (setUserId)
    const [weight, setWeight] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


    const handleSubmit = () => {
        // FIX: Pre-check authentication status
        if (!isAuthenticated || !userId) {
            setError("Must be logged in to update metrics.");
            return;
        }

        if (!weight || parseFloat(weight) <= 0) {
            setError("Please enter a valid weight.");
            return;
        }
        
        setError(null);
        setSuccess(null);
        setLoading(true);
        
        // FIX: Use the dedicated service function to record the health metric 
        // The service automatically handles the POST /api/health-metrics endpoint.
        recordHealthMetric({
            userId: userId,
            weight: parseFloat(weight)
            // BMI calculation is handled automatically by HealthMetricService.java
        })
            .then(res => {
                // The backend API is returning a HealthMetric object, but we display a generic success
                setSuccess("Health metrics updated successfully! BMI recalculated.");
                
                // IMPORTANT: Trigger re-fetch of user profile/data so Dashboard/Profile updates
                fetchUserProfile(userId); 

                // Close the modal after a brief delay
                setTimeout(closeModal, 1500); 
            })
            .catch(err => {
                console.error(err);
                // FIX: Update error message extraction to be more robust for different APIs
                const errorMessage = err.response?.data?.message || err.message || "Error updating metrics. Check server status or credentials.";
                setError(errorMessage);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="p-2 space-y-6">
            <p className="text-text-muted">
                Update your current weight to recalculate your BMI and track progress.
            </p>
            {error && (
                <motion.div 
                    className="text-accent-red bg-red-100 p-3 rounded-xl text-sm border border-red-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {error.toString()}
                </motion.div>
            )}
            {success && (
                 <motion.div 
                    className="text-accent-green bg-green-100 p-3 rounded-xl text-sm border border-green-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {success}
                </motion.div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">User ID</label>
                    <input
                        type="number"
                        className="input-field bg-gray-50 cursor-not-allowed"
                        placeholder="Logged in User ID"
                        value={userId || ''} 
                        disabled
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">New Weight (kg)</label>
                    <input
                        type="number"
                        step="0.1"
                        className="input-field"
                        placeholder="Enter new weight"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                    />
                </div>
            </div>
            <button
                className="w-full btn-primary"
                onClick={handleSubmit}
                disabled={loading || !!success || !isAuthenticated || !userId} 
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Updating Metrics...
                    </span>
                ) : (
                    "Update Metrics"
                )}
            </button>
        </div>
    );
};

export default UpdateBMI;