import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error("Error fetching users:", err));
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                    <div key={user.userId} className="bg-blue-50 p-5 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-sm mt-2">
                            Age: {user.age}, Weight: {user.weight}kg, Height: {user.height}cm
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Users;
