// src/components/Dashboard.jsx
import React from "react";

const Dashboard = ({ users, exercises, meals }) => {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Health Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                                <span className="text-xl">👥</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                                <span className="text-xl">💪</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Exercises Logged</h3>
                                <p className="text-2xl font-bold">{exercises.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                                <span className="text-xl">🍎</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Meals Tracked</h3>
                                <p className="text-2xl font-bold">{meals.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Activities</h3>
                    <div className="space-y-4">
                        {exercises.slice(0, 3).map(exercise => (
                            <div key={exercise.exerciseId} className="flex items-center p-3 bg-blue-50 rounded-lg">
                                <div className="p-2 bg-blue-100 rounded-full mr-3">
                                    <span className="text-blue-500">💪</span>
                                </div>
                                <div>
                                    <p className="font-medium">User {exercise.userId} logged {exercise.exerciseName} for {exercise.durationMinutes} minutes</p>
                                    <p className="text-sm text-gray-500">Burned {exercise.caloriesBurned} calories</p>
                                </div>
                            </div>
                        ))}

                        {meals.slice(0, 3).map(meal => (
                            <div key={meal.mealId} className="flex items-center p-3 bg-green-50 rounded-lg">
                                <div className="p-2 bg-green-100 rounded-full mr-3">
                                    <span className="text-green-500">🍎</span>
                                </div>
                                <div>
                                    <p className="font-medium">User {meal.userId} logged {meal.mealName}</p>
                                    <p className="text-sm text-gray-500">Consumed {meal.caloriesConsumed} calories</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;