// src/App.js
import { useEffect, useState } from "react";
import { getAllUsers } from "./services/UserService";
import { getExercisesByUser } from "./services/ExerciseService";
import { getMealsByUser } from "./services/MealService";
import Dashboard from "./components/Dashboard";
import AddUser from "./components/AddUser";
import AddExercise from "./components/AddExercise";
import AddMeal from "./components/AddMeal";
import UpdateBMI from "./components/UpdateBMI";
import Navigation from "./components/Navigation";
import Users from "./components/Users"; // Using the consolidated Users component
import Exercises from "./components/Exercises";
import MealsPage from "./pages/Meals";
import Footer from "./components/Footer";
import Login from "./pages/Login";      // <-- NEW IMPORT
import Register from "./pages/Register"; // <-- NEW IMPORT

function App() {
    const [users, setUsers] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [meals, setMeals] = useState([]);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [authToken, setAuthToken] = useState(localStorage.getItem("token")); // <-- NEW STATE
    const DEMO_USER_ID = 1; // Hardcoded user ID for fetching user-specific dashboard data

    useEffect(() => {
        fetchData();
    }, []);

    // --- Data Fetching Functions (Using the Services) ---

    const fetchUsers = () => {
        getAllUsers()
            .then(res => setUsers(res.data))
            .catch(err => console.error("Error fetching all users:", err));
    };

    const fetchExercises = () => {
        getExercisesByUser(DEMO_USER_ID)
            .then(res => setExercises(res.data))
            .catch(err => console.error("Error fetching exercises:", err));
    };

    const fetchMeals = () => {
        getMealsByUser(DEMO_USER_ID)
            .then(res => setMeals(res.data))
            .catch(err => console.error("Error fetching meals:", err));
    };

    const fetchData = () => {
        fetchUsers();
        fetchExercises();
        fetchMeals();
    };
    
    // --- Auth Handlers ---
    const handleLoginSuccess = (token) => {
        setAuthToken(token);
        setActiveTab("dashboard");
        fetchData(); // Refresh dashboard data now that we are "logged in"
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setAuthToken(null);
        setActiveTab("login");
    };
    
    // --- Content Renderer ---
    
    const renderContent = () => {
        switch(activeTab) {
            case "login":
                return <Login onLoginSuccess={handleLoginSuccess} switchToRegister={() => setActiveTab("register")} />;
            case "register":
                return <Register switchToLogin={() => setActiveTab("login")} />;
            case "dashboard":
                return <Dashboard users={users} exercises={exercises} meals={meals} />;
            case "users":
                return <Users />; 
            case "exercises":
                return <Exercises />;
            case "meals":
                return <MealsPage />; 
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
            <Footer />
        </div>
    );
}

export default App;