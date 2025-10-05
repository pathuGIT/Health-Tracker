import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get("http://localhost:8080/api/users", {
                    timeout: 10000,
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                console.log("Users API Response:", response);

                // Handle different response structures
                let usersData = response.data;

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

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Users
                </h2>
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">Loading users...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Users
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <div className="text-red-500 text-4xl mb-4">👥</div>
                    <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Users</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Users
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {users.length} {users.length === 1 ? 'user' : 'users'} registered
                    </p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                    Refresh
                </button>
            </div>

            {users.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h3>
                    <p className="text-gray-500">No users have been registered yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map(user => (
                        <div
                            key={user.userId}
                            className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300 hover:border-blue-200 group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-700 transition-colors">
                                        {user.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                                <div className="bg-blue-100 px-3 py-2 rounded-lg text-center">
                                    <p className="text-blue-700 font-bold">{user.age}</p>
                                    <p className="text-blue-600 text-xs">Age</p>
                                </div>
                                <div className="bg-green-100 px-3 py-2 rounded-lg text-center">
                                    <p className="text-green-700 font-bold">{user.weight}kg</p>
                                    <p className="text-green-600 text-xs">Weight</p>
                                </div>
                                <div className="bg-purple-100 px-3 py-2 rounded-lg text-center">
                                    <p className="text-purple-700 font-bold">{user.height}cm</p>
                                    <p className="text-purple-600 text-xs">Height</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-2 rounded-lg">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">User ID</span>
                                    <span className="text-gray-800 font-mono font-semibold">{user.userId}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Users;