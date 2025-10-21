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
import Users from "./components/Users";
import Exercises from './components/Exercises'; 
import MealsPage from "./pages/Meals"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile"; 
import Sidebar from "./components/Sidebar"; 
import Modal from "./components/Modal"; 
import { useAuth } from "./context/AuthContext"; 


function App() {
    // FIX: Get isAdmin flag
    const { userId, authToken, handleLogout, isAuthLoading, isAdmin } = useAuth();
    
    const [users, setUsers] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [meals, setMeals] = useState([]);
    const [activeTab, setActiveTab] = useState("dashboard"); 
    
    const [modalContent, setModalContent] = useState(null); 
    
    // --- Data Fetching Functions ---
    const fetchUsers = useCallback(() => {
        // Only fetch users if Admin is logged in, or if we need a demo user list (but dashboard mostly uses user's data)
        // Since Users.jsx fetches all users, we only need to call this if we are actively viewing the Users page.
        // Keeping this for Dashboard display in unauthenticated state for demo/legacy.
        getAllUsers()
            .then(res => setUsers(res.data))
            .catch(err => console.error("Error fetching all users:", err));
    }, []);

    const fetchExercises = useCallback(() => {
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
        
        if (isAuthLoading) {
            setExercises([]);
            setMeals([]);
            return;
        }
        
        // Admins and Users need Dashboard data (but Admin Dashboard might show different things)
        if (isAdmin || activeTab === "users") {
            fetchUsers(); 
        }

        if (userId && !isAdmin) { // Fetch user-specific data only for non-admin users
            fetchExercises();
            fetchMeals();
        } else {
            // Clear user-specific data for Admin/Unauthenticated
            setExercises([]);
            setMeals([]);
        }
    }, [userId, isAuthLoading, isAdmin, activeTab, fetchUsers, fetchExercises, fetchMeals]);

    useEffect(() => {
        // Set initial tab based on auth state
        if (authToken && (activeTab === "login" || activeTab === "register")) {
            // Default authenticated view
            setActiveTab("dashboard");
        } else if (!authToken && (activeTab !== "dashboard" && activeTab !== "login" && activeTab !== "register")) {
            // Redirect unauthorized access to dashboard/login prompt
            setActiveTab("dashboard");
        }
        fetchData();
    }, [authToken, fetchData, activeTab]);

    // --- Modal Handlers ---
    const openModal = (content) => {
        setModalContent(content);
    };

    const closeModal = () => {
        setModalContent(null);
    };

    const handleLoginSuccess = () => { 
        setActiveTab("dashboard");
        closeModal(); 
    };

    const handleTabChange = (tabId) => {
        // Check if the user is authorized for the tab/modal
        const isUserSpecific = ["profile", "exercises", "meals", "addExercise", "addMeal", "updateBMI"].includes(tabId);
        const isRestrictedToAdmin = ["users", "addUser"].includes(tabId);

        if (isUserSpecific && !userId) {
            return handleTabChange("login");
        }
        
        // This is a minimal implementation, proper role-based authorization would be better
        if (isRestrictedToAdmin && !isAdmin) {
             // If a regular user somehow clicks an admin link (not visible in the sidebar, but for safety)
             setActiveTab("dashboard");
             return alert("Access Denied: Admin privileges required.");
        }


        // Logic for showing forms in a modal
        switch(tabId) {
            case "addUser":
                openModal(<AddUser onUserAdded={() => { fetchUsers(); closeModal(); }} />);
                break;
            case "addExercise":
                openModal(<AddExercise onExerciseAdded={() => { fetchExercises(); closeModal(); }} />);
                break;
            case "addMeal":
                openModal(<AddMeal onMealAdded={() => { fetchMeals(); closeModal(); }} />);
                break;
            case "updateBMI":
                openModal(<UpdateBMI closeModal={() => { 
                    fetchData(); // Re-fetch user data to update dashboard/profile
                    closeModal(); 
                }} />); 
                break;
            case "login":
                openModal(<Login onLoginSuccess={handleLoginSuccess} switchToRegister={() => { closeModal(); openModal(<Register switchToLogin={() => { closeModal(); handleTabChange("login"); }} />); }} />);
                break;
            case "register":
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
                // If admin views exercises, they get a blank page. Restricting to non-admin or forcing user to profile tab
                if (isAdmin) return <p className="card p-5">Admin view of exercises is not fully implemented. Please view individual user data.</p>;
                return <Exercises />;
            case "meals":
                if (isAdmin) return <p className="card p-5">Admin view of meals is not fully implemented. Please view individual user data.</p>;
                return <MealsPage />; 
            case "profile":
                if (isAdmin) return <p className="card p-5">Admin does not have a user profile page. Switch to Dashboard or Users tab.</p>;
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