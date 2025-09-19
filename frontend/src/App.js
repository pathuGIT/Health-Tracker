import { useEffect, useState } from "react";
import axios from "axios";
import AddUser from "./components/AddUser";
import AddExercise from "./components/AddExercise";
import AddMeal from "./components/AddMeal";
import UpdateBMI from "./components/UpdateBMI";

function App() {
    const [users, setUsers] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [meals, setMeals] = useState([]);
    const [activeTab, setActiveTab] = useState("users");

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

    return (
        <div style={{ padding: "20px" }}>
            <h1>Health Tracker Application</h1>

            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => setActiveTab("users")} style={{ marginRight: "10px" }}>Users</button>
                <button onClick={() => setActiveTab("exercises")} style={{ marginRight: "10px" }}>Exercises</button>
                <button onClick={() => setActiveTab("meals")} style={{ marginRight: "10px" }}>Meals</button>
                <button onClick={() => setActiveTab("addUser")} style={{ marginRight: "10px" }}>Add User</button>
                <button onClick={() => setActiveTab("addExercise")} style={{ marginRight: "10px" }}>Add Exercise</button>
                <button onClick={() => setActiveTab("addMeal")} style={{ marginRight: "10px" }}>Add Meal</button>
                <button onClick={() => setActiveTab("updateBMI")}>Update BMI</button>
            </div>

            {activeTab === "users" && (
                <div>
                    <h2>Users</h2>
                    <ul>
                        {users.map(user => (
                            <li key={user.userId}>
                                {user.name} ({user.email}) - Age: {user.age}, Weight: {user.weight}, Height: {user.height}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === "exercises" && (
                <div>
                    <h2>Exercises</h2>
                    <ul>
                        {exercises.map(exercise => (
                            <li key={exercise.exerciseId}>
                                User ID: {exercise.userId} - {exercise.exerciseName}: {exercise.durationMinutes} mins, {exercise.caloriesBurned} calories
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === "meals" && (
                <div>
                    <h2>Meals</h2>
                    <ul>
                        {meals.map(meal => (
                            <li key={meal.mealId}>
                                User ID: {meal.userId} - {meal.mealName}: {meal.caloriesConsumed} calories
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === "addUser" && <AddUser onUserAdded={fetchUsers} />}
            {activeTab === "addExercise" && <AddExercise onExerciseAdded={fetchExercises} />}
            {activeTab === "addMeal" && <AddMeal onMealAdded={fetchMeals} />}
            {activeTab === "updateBMI" && <UpdateBMI />}
        </div>
    );
}

export default App;