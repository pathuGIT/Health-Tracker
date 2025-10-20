import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllUsers } from "../services/UserService"; 

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getAllUsers();
                let usersData = response.data;

                // Handle unexpected response wrappers if necessary
                if (usersData && usersData.data) {
                    usersData = usersData.data;
                }
                if (usersData && usersData.users) {
                    usersData = usersData.users;
                }

                if (Array.isArray(usersData)) {
                    setUsers(usersData);
                } else {
                    setError("Invalid data format received from server");
                }

            } catch (err) {
                console.error("Error fetching users:", err);
                if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNREFUSED') {
                    setError("Cannot connect to server. Make sure the backend is running on port 8080.");
                } else if (err.response) {
                    setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
                } else if (err.request) {
                    setError("No response from server. Check if the server is running.");
                } else {
                    setError("Failed to fetch users: " + err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const calculateBMI = (weight, height) => {
        if (!weight || !height) return 'N/A';
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }

    if (loading) {
        return (
            <div className="card text-center py-12">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-text-muted">Loading user profiles...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <div className="text-accent-red text-4xl mb-4">⚠️</div>
                    <h3 className="text-text-dark font-semibold text-lg mb-2">Error Loading Users</h3>
                    <p className="text-text-muted mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-accent-red text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex justify-between items-center">
                <p className="text-text-muted">
                    {users.length} {users.length === 1 ? 'user' : 'users'} registered in the system.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-100 text-text-dark rounded-xl hover:bg-gray-200 transition-colors font-semibold text-sm"
                >
                    Refresh List
                </button>
            </div>

            {users.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-semibold text-text-dark mb-2">No Users Found</h3>
                    <p className="text-text-muted">No users have been registered yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user, index) => (
                        <motion.div
                            key={user.userId}
                            className="card p-5"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-xl text-primary-blue">
                                        {user.name}
                                    </h3>
                                    <p className="text-text-muted text-sm">{user.email}</p>
                                </div>
                                <div className="w-10 h-10 bg-primary-blue bg-opacity-20 rounded-full flex items-center justify-center text-primary-blue font-bold text-lg">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                                <div className="bg-gray-100 px-3 py-2 rounded-xl text-center">
                                    <p className="text-text-dark font-bold">{user.age}</p>
                                    <p className="text-text-muted text-xs">Age</p>
                                </div>
                                <div className="bg-gray-100 px-3 py-2 rounded-xl text-center">
                                    <p className="text-text-dark font-bold">{user.weight}kg</p>
                                    <p className="text-text-muted text-xs">Weight</p>
                                </div>
                                <div className="bg-gray-100 px-3 py-2 rounded-xl text-center">
                                    <p className="text-text-dark font-bold">{user.height}cm</p>
                                    <p className="text-text-muted text-xs">Height</p>
                                </div>
                            </div>
                            
                            <div className="bg-primary-blue bg-opacity-10 px-4 py-2 rounded-xl mt-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-primary-blue font-semibold">BMI</span>
                                    <span className="text-primary-blue font-extrabold">{calculateBMI(user.weight, user.height)}</span>
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Users;