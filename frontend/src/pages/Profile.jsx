// src/pages/Profile.jsx
import { motion } from "framer-motion";
import BMIChart from "../components/charts/BMIChart";
import CaloriesChart from "../components/charts/CaloriesChart";
// In a real application, fetch this data from the API
const user = {
    name: "John Doe (Demo User)",
    age: 25,
    height: 175, // cm
    weight: 72, // kg
    bmi: 23.5, // Calculated: 72 / (1.75 * 1.75) = 23.51
};

const Profile = () => {
    return (
        <motion.div 
            className="max-w-4xl mx-auto space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h1 className="text-3xl font-bold text-primary-blue mb-6 border-b pb-3">
                {user.name}’s Profile 👤
            </h1>

            {/* User Info Card */}
            <motion.div 
                className="card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="lg:col-span-4 mb-2">
                    <h2 className="text-xl font-semibold text-text-dark border-b border-gray-100 pb-2">Personal Metrics</h2>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-text-muted">Age</p>
                    <p className="text-xl font-bold text-text-dark">{user.age}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-text-muted">Height</p>
                    <p className="text-xl font-bold text-text-dark">{user.height} cm</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-text-muted">Weight</p>
                    <p className="text-xl font-bold text-text-dark">{user.weight} kg</p>
                </div>
                <div className="bg-primary-blue bg-opacity-10 p-4 rounded-xl border border-primary-blue/20">
                    <p className="text-sm font-medium text-primary-blue">Current BMI</p>
                    <p className="text-xl font-bold text-primary-blue">{user.bmi}</p>
                </div>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                    className="card p-6"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-xl font-semibold text-accent-green mb-4 border-b border-gray-100 pb-2">BMI History ⚖️</h2>
                    <BMIChart />
                </motion.div>
                <motion.div 
                    className="card p-6"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-xl font-semibold text-primary-blue mb-4 border-b border-gray-100 pb-2">Calories Summary 📈</h2>
                    <CaloriesChart />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Profile;