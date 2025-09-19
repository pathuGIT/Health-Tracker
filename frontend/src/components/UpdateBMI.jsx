// src/components/UpdateBMI.jsx
import axios from "axios";
import { useState } from "react";

const UpdateBMI = () => {
    const [userId, setUserId] = useState("");
    const [weight, setWeight] = useState("");

    const handleSubmit = () => {
        axios.post(`http://localhost:8080/api/bmi?userId=${userId}&weight=${weight}`)
            .then(res => alert(res.data))
            .catch(err => alert(err));
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Update BMI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter user ID"
                        onChange={e => setUserId(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Weight</label>
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter new weight"
                        onChange={e => setWeight(e.target.value)}
                    />
                </div>
            </div>
            <button
                className="mt-6 px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                onClick={handleSubmit}
            >
                Update BMI
            </button>
        </div>
    );
};

export default UpdateBMI;