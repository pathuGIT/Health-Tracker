// frontend/src/App.js
import { useEffect, useState, useCallback } from "react";
import { getAllUsers } from "./services/UserService";
import { getExercisesByUser } from "./services/ExerciseService";
import { getMealsByUser } from "./services/MealService";
import Dashboard from "./components/Dashboard";
import AddUser from "./components/AddUser";
import AddExercise from "./components/AddExercise";
import AddMeal from "./components/AddMeal";
import UpdateBMI from "./components/UpdateBMI";
// import Navigation from "./components/Navigation"; // REMOVED
// import Footer from "./components/Footer"; // REMOVED
import Users from "./components/Users";
import Exercises from './components/Exercises'; // Update this path
import MealsPage from "./pages/Meals"; // Using the redesigned version
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile"; // NEW IMPORT
import Sidebar from "./components/Sidebar"; // NEW IMPORT
import Modal from "./components/Modal"; // NEW IMPORT
import { useAuth } from "./context/AuthContext"; // NEW IMPORT


function App() {
    // FIX: Get isAuthLoading from context
    const { userId, authToken, handleLogout, isAuthLoading } = useAuth();
    
    const [users, setUsers] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [meals, setMeals] = useState([]);
    const [activeTab, setActiveTab] = useState("dashboard"); 
    
    const [modalContent, setModalContent] = useState(null); 
    
    // --- Data Fetching Functions (Using the Services) ---
    const fetchUsers = useCallback(() => {
        getAllUsers()
            .then(res => setUsers(res.data))
            .catch(err => console.error("Error fetching all users:", err));
    }, []);

    const fetchExercises = useCallback(() => {
        // Only fetch if userId is present (guaranteed to be stable inside fetchData block)
        if (!userId) { 
            setExercises([]);
            return;
        }
        getExercisesByUser(userId) 
            .then(res => {
                setExercises(res.data.data?.exercises || res.data.data || res.data.exercises || res.data || []);
            })
            .catch(err => console.error("Error fetching exercises:", err));
    }, [userId]); 

    const fetchMeals = useCallback(() => {
        // Only fetch if userId is present (guaranteed to be stable inside fetchData block)
        if (!userId) { 
            setMeals([]);
            return;
        }
        getMealsByUser(userId) 
            .then(res => {
                setMeals(res.data.data?.meals || res.data.data || res.data.meals || res.data || []);
            })
            .catch(err => console.error("Error fetching meals:", err));
    }, [userId]); 

    const fetchData = useCallback(() => {
        fetchUsers(); 
        
        // FIX: Block fetching user-specific data while authentication/user profile is loading
        if (isAuthLoading) {
            setExercises([]);
            setMeals([]);
            return;
        }

        // If loading is done, check userId to trigger fetches for authenticated user
        if (userId) { 
            fetchExercises();
            fetchMeals();
        } else {
            setExercises([]);
            setMeals([]);
        }
    }, [userId, isAuthLoading, fetchUsers, fetchExercises, fetchMeals]); // ADD isAuthLoading dependency

    useEffect(() => {
        // Set initial tab based on auth state
        if (authToken && (activeTab === "login" || activeTab === "register")) {
            setActiveTab("dashboard");
        } else if (!authToken && (activeTab !== "dashboard" && activeTab !== "login" && activeTab !== "register")) {
            // Redirect unauthorized access to dashboard/login prompt
            setActiveTab("dashboard");
        }
        fetchData();
    }, [authToken, fetchData, activeTab]);

    // --- Auth Handlers ---
    const handleLoginSuccess = () => { 
        // Logic handled by AuthContext, now just close modal and set tab
        setActiveTab("dashboard");
        closeModal(); 
    };

    // handleLogout is provided by useAuth context

    // --- Modal Handlers ---
    const openModal = (content) => {
        setModalContent(content);
    };

    const closeModal = () => {
        setModalContent(null);
    };

    const handleTabChange = (tabId) => {
        // Logic for showing forms in a modal
        switch(tabId) {
            case "addUser":
                openModal(<AddUser onUserAdded={() => { fetchUsers(); closeModal(); }} />);
                break;
            case "addExercise":
                if (!userId) return handleTabChange("login"); 
                openModal(<AddExercise onExerciseAdded={() => { fetchExercises(); closeModal(); }} />);
                break;
            case "addMeal":
                if (!userId) return handleTabChange("login");
                openModal(<AddMeal onMealAdded={() => { fetchMeals(); closeModal(); }} />);
                break;
            case "updateBMI":
                if (!userId) return handleTabChange("login");
                openModal(<UpdateBMI closeModal={() => { 
                    fetchData(); // Re-fetch user data to update dashboard/profile
                    closeModal(); 
                }} />); 
                break;
            case "login":
                // Nested modals for seamless switching between login/register
                openModal(<Login onLoginSuccess={handleLoginSuccess} switchToRegister={() => { closeModal(); openModal(<Register switchToLogin={() => { closeModal(); handleTabChange("login"); }} />); }} />);
                break;
            case "register":
                // Nested modals for seamless switching between register/login
                openModal(<Register switchToLogin={() => { closeModal(); openModal(<Login onLoginSuccess={handleLoginSuccess} switchToRegister={() => { closeModal(); openModal(null); }} />) }} />);
                break;
            default:
                setActiveTab(tabId);
        }
    };
    
    // --- Content Renderer ---
    const renderContent = () => {
        // For unauthenticated users, only show the login prompt on the dashboard
        if (!authToken && activeTab !== "dashboard") {
            return (
                <div className="card text-center max-w-2xl mx-auto p-10 mt-10">
                    <h1 className="text-4xl font-extrabold text-primary-blue mb-4">Access Denied</h1>
                    <p className="text-text-muted mb-6">
                        You must be logged in to view this page.
                    </p>
                    <button
                        className="btn-primary"
                        onClick={() => handleTabChange("login")}
                    >
                        🔑 Log In / Register Now
                    </button>
                </div>
            );
        }

        switch(activeTab) {
            case "dashboard":
                return <Dashboard users={users} exercises={exercises} meals={meals} showLoginPrompt={!authToken} onLoginClick={() => handleTabChange("login")} />;
            case "users":
                return <Users />; 
            case "exercises":
                return <Exercises />;
            case "meals":
                return <MealsPage />; 
            case "profile":
                return <Profile />;
            default:
                return <Dashboard users={users} exercises={exercises} meals={meals} showLoginPrompt={!authToken} onLoginClick={() => handleTabChange("login")} />;
        }
    };

    // Determine modal title dynamically
    let modalTitle = "";
    if (modalContent) {
        if (modalContent.type === AddUser) modalTitle = "Register New User";
        else if (modalContent.type === AddExercise) modalTitle = "Log New Workout";
        else if (modalContent.type === AddMeal) modalTitle = "Log New Meal";
        else if (modalContent.type === UpdateBMI) modalTitle = "Update Health Metrics";
        else if (modalContent.type === Login) modalTitle = "User Login";
        else if (modalContent.type === Register) modalTitle = "Create Account";
        else modalTitle = "Form";
    }

    return (
        <div className="min-h-screen bg-background-light flex">
            {/* Left Sidebar Navigation */}
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={handleTabChange}
                onLogout={handleLogout}
                authToken={authToken}
            />

            {/* Main Content Area */}
            <div className="flex-grow ml-64 p-8">
                {/* Header for main content area */}
                <header className="mb-8 flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-text-dark capitalize">
                        {/* Display a nicer header based on the active tab */}
                        {activeTab === "meals" ? "Nutrition Log" : 
                         activeTab === "exercises" ? "Workout Log" : 
                         activeTab.replace(/([A-Z])/g, ' $1').trim()}
                    </h2>
                </header>

                {/* Content */}
                <main className="min-h-[70vh]">
                    {renderContent()}
                </main>

                {/* Footer - Minimalist */}
                <footer className="mt-12 text-center text-text-muted text-sm">
                    &copy; {new Date().getFullYear()} FitTrack Pro. All rights reserved.
                </footer>
            </div>

            {/* Global Modal - Will render if modalContent is set */}
            <Modal isOpen={!!modalContent} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>
        </div>
    );
}

export default App;