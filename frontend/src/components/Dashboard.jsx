// src/components/Dashboard.jsx
import React from "react";
import "../index.css";

const Dashboard = ({ users, exercises, meals }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-xl">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">F</span>
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                FitTrack Pro
                            </h1>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="#" className="text-white/80 hover:text-white font-medium transition-colors backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white/10">Dashboard</a>
                            <a href="#" className="text-white/80 hover:text-white font-medium transition-colors backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white/10">Workouts</a>
                            <a href="#" className="text-white/80 hover:text-white font-medium transition-colors backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white/10">Nutrition</a>
                            <a href="#" className="text-white/80 hover:text-white font-medium transition-colors backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white/10">Progress</a>
                        </nav>
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                                {users.length > 0 ? users[0].name?.charAt(0) || 'U' : 'A'}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Dashboard Content */}
            <main className="container mx-auto px-6 py-8">
                <div className="space-y-8">
                    {/* Hero Section */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 text-white border border-white/20">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="mb-6 md:mb-0">
                                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                    Elevate Your Fitness Journey!
                                </h1>
                                <p className="text-white/80 text-lg">Transform your body, transform your life with cutting-edge tracking</p>
                            </div>
                            <div className="w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <span className="text-4xl">💎</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 hover:scale-105 transition-transform duration-300 border border-white/20 hover:bg-white/15">
                            <div className="flex items-center">
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 text-white mr-4">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white/80">Active Users</h3>
                                    <p className="text-3xl font-bold text-white">{users.length}</p>
                                    <p className="text-sm text-green-400 mt-1">+12% this month</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 hover:scale-105 transition-transform duration-300 border border-white/20 hover:bg-white/15">
                            <div className="flex items-center">
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-white/20 text-white mr-4">
                                    <span className="text-2xl">💪</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white/80">Exercises Logged</h3>
                                    <p className="text-3xl font-bold text-white">{exercises.length}</p>
                                    <p className="text-sm text-green-400 mt-1">+8% from last week</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 hover:scale-105 transition-transform duration-300 border border-white/20 hover:bg-white/15">
                            <div className="flex items-center">
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm border border-white/20 text-white mr-4">
                                    <span className="text-2xl">🍎</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white/80">Meals Tracked</h3>
                                    <p className="text-3xl font-bold text-white">{meals.length}</p>
                                    <p className="text-sm text-green-400 mt-1">+15% from last week</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Recent Exercises</h3>
                                <span className="text-purple-300 bg-purple-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-purple-500/30">
                                    Active
                                </span>
                            </div>
                            <div className="space-y-4">
                                {exercises.slice(0, 4).map(exercise => (
                                    <div key={exercise.exerciseId} className="flex items-center p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-white/20 hover:scale-102 transition-transform duration-200 backdrop-blur-sm">
                                        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-sm border border-white/20 text-white mr-4 shadow-lg">
                                            <span className="text-lg">💪</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-white">{exercise.exerciseName}</p>
                                                    <p className="text-sm text-white/60">User {exercise.userId}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-purple-300">{exercise.durationMinutes} min</p>
                                                    <p className="text-sm text-red-300 font-medium">{exercise.caloriesBurned} cal</p>
                                                </div>
                                            </div>
                                            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full backdrop-blur-sm"
                                                    style={{ width: `${Math.min((exercise.durationMinutes / 60) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Recent Meals</h3>
                                <span className="text-green-300 bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                                    Healthy
                                </span>
                            </div>
                            <div className="space-y-4">
                                {meals.slice(0, 4).map(meal => (
                                    <div key={meal.mealId} className="flex items-center p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-white/20 hover:scale-102 transition-transform duration-200 backdrop-blur-sm">
                                        <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/30 to-emerald-500/30 backdrop-blur-sm border border-white/20 text-white mr-4 shadow-lg">
                                            <span className="text-lg">🍎</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-white">{meal.mealName}</p>
                                                    <p className="text-sm text-white/60">User {meal.userId}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-300">{meal.caloriesConsumed} cal</p>
                                                    <p className="text-sm text-white/60">Tracked</p>
                                                </div>
                                            </div>
                                            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full backdrop-blur-sm"
                                                    style={{ width: `${Math.min((meal.caloriesConsumed / 800) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Motivation Section */}
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl shadow-xl p-8 text-white text-center border border-white/20">
                        <h3 className="text-2xl font-bold mb-4">Unleash Your Potential! 🚀</h3>
                        <p className="text-white/80 text-lg">
                            {exercises.length > 0
                                ? `Amazing! ${exercises.length} exercises conquered and ${meals.length} meals optimized this week!`
                                : 'Your transformation starts now - embrace the journey!'}
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-black/40 backdrop-blur-md border-t border-white/20 py-12 mt-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold">F</span>
                                </div>
                                <span className="text-xl font-bold text-white">FitTrack Pro</span>
                            </div>
                            <p className="text-white/60 mb-4 max-w-md">
                                Your premium fitness companion. Experience next-level tracking with glass-morphism design and advanced analytics.
                            </p>
                            <div className="flex space-x-4">
                                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-500/30 transition-colors cursor-pointer border border-white/20">
                                    <span className="text-white">📘</span>
                                </div>
                                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-400/30 transition-colors cursor-pointer border border-white/20">
                                    <span className="text-white">🐦</span>
                                </div>
                                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-pink-500/30 transition-colors cursor-pointer border border-white/20">
                                    <span className="text-white">📷</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-4 text-white">Quick Links</h4>
                            <ul className="space-y-2 text-white/60">
                                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Workouts</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Nutrition</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Progress</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-4 text-white">Support</h4>
                            <ul className="space-y-2 text-white/60">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
                        <p>&copy; 2024 FitTrack Pro. All rights reserved. Crafted with 💎 for modern fitness enthusiasts.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;