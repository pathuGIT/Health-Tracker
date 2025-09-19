// src/components/Navigation.jsx
import React from "react";

const Navigation = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "users", label: "Users", icon: "👥" },
        { id: "exercises", label: "Exercises", icon: "💪" },
        { id: "meals", label: "Meals", icon: "🍎" },
        { id: "addUser", label: "Add User", icon: "➕" },
        { id: "addExercise", label: "Add Exercise", icon: "➕" },
        { id: "addMeal", label: "Add Meal", icon: "➕" },
        { id: "updateBMI", label: "Update BMI", icon: "⚖️" },
    ];

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <h1 className="text-2xl font-bold">Health Tracker</h1>
                </div>
                <div className="overflow-x-auto">
                    <div className="flex space-x-1 py-2">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === item.id ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;