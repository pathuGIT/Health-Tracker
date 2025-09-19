// src/pages/Profile.jsx
import BMIChart from "../components/Charts/BMIChart";
import CaloriesChart from "../components/Charts/CaloriesChart";

const Profile = () => {
    const user = {
        name: "John Doe",
        age: 25,
        height: 175,
        weight: 72,
        bmi: 23.5,
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {user.name}’s Profile
            </h1>

            {/* User info */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-indigo-600 mb-2">User Info</h2>
                <p>Age: {user.age}</p>
                <p>Height: {user.height} cm</p>
                <p>Weight: {user.weight} kg</p>
                <p>BMI: {user.bmi}</p>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">BMI History</h2>
                    <BMIChart />
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">Calories Summary</h2>
                    <CaloriesChart />
                </div>
            </div>
        </div>
    );
};

export default Profile;
