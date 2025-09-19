// src/App.js
import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./components/Dashboard";
import AddUser from "./components/AddUser";
import AddExercise from "./components/AddExercise";
import AddMeal from "./components/AddMeal";
import UpdateBMI from "./components/UpdateBMI";
import Navigation from "./components/Navigation";

function App() {
    const [users, setUsers] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [meals, setMeals] = useState([]);
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        fetchUsers();
        fetchExercises();
        fetchMeals();
    }, []);

    const fetchUsers = () => {
        axios.get("http://localhost:8080/api/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error("Error fetching users:", err));
    };

    const fetchExercises = () => {
        axios.get("http://localhost:8080/api/exercise")
            .then(res => setExercises(res.data))
            .catch(err => console.error("Error fetching exercises:", err));
    };

    const fetchMeals = () => {
        axios.get("http://localhost:8080/api/meal")
            .then(res => setMeals(res.data))
            .catch(err => console.error("Error fetching meals:", err));
    };

    const renderContent = () => {
        switch(activeTab) {
            case "dashboard":
                return <Dashboard users={users} exercises={exercises} meals={meals} />;
            case "users":
                return (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Users</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {users.map(user => (
                                <div key={user.userId} className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg">{user.name}</h3>
                                    <p className="text-gray-600">{user.email}</p>
                                    <p className="text-sm mt-2">Age: {user.age}, Weight: {user.weight}, Height: {user.height}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "exercises":
                return (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Exercises</h2>
                        <div className="space-y-4">
                            {exercises.map(exercise => (
                                <div key={exercise.exerciseId} className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-semibold">{exercise.exerciseName}</h3>
                                    <p>User ID: {exercise.userId} - Duration: {exercise.durationMinutes} mins</p>
                                    <p>Calories burned: {exercise.caloriesBurned}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "meals":
                return (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Meals</h2>
                        <div className="space-y-4">
                            {meals.map(meal => (
                                <div key={meal.mealId} className="bg-yellow-50 p-4 rounded-lg">
                                    <h3 className="font-semibold">{meal.mealName}</h3>
                                    <p>User ID: {meal.userId}</p>
                                    <p>Calories: {meal.caloriesConsumed}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "addUser":
                return <AddUser onUserAdded={fetchUsers} />;
            case "addExercise":
                return <AddExercise onExerciseAdded={fetchExercises} />;
            case "addMeal":
                return <AddMeal onMealAdded={fetchMeals} />;
            case "updateBMI":
                return <UpdateBMI />;
            default:
                return <Dashboard users={users} exercises={exercises} meals={meals} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="container mx-auto px-4 py-8">
                {renderContent()}
            </div>
        </div>
    );
}

export default App;