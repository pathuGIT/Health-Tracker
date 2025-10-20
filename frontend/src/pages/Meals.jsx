import { useEffect, useState } from "react";
import { getMealsByUser } from "../services/MealService";

const DEMO_USER_ID = 1; // or get from props/context

const Meals = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getMealsByUser(DEMO_USER_ID);

                let mealsData = response.data;

                if (Array.isArray(mealsData)) {
                    setMeals(mealsData);
                } else if (mealsData && mealsData.data && Array.isArray(mealsData.data)) {
                    // Handle wrapped response data structure if necessary
                    setMeals(mealsData.data);
                } else if (mealsData && mealsData.meals && Array.isArray(mealsData.meals)) {
                    // Handle wrapped response data structure if necessary
                    setMeals(mealsData.meals);
                } else {
                    // Default to empty array if data structure is unexpected
                    setMeals([]);
                }

            } catch (err) {
                console.error("Error fetching meals:", err);

                if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNREFUSED') {
                    setError("Cannot connect to server. Make sure the backend is running on port 8080.");
                } else if (err.response) {
                    setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
                } else if (err.request) {
                    setError("No response from server. Check if the server is running.");
                } else {
                    setError("Failed to fetch meals: " + err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMeals();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                    Meals
                </h2>
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">Loading meals...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                    Meals
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <div className="text-red-500 text-4xl mb-4">🍎</div>
                    <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Meals</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                        Meals
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {meals.length} {meals.length === 1 ? 'meal' : 'meals'} logged for User ID {DEMO_USER_ID}
                    </p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                    Refresh
                </button>
            </div>

            {meals.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🍎</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Meals Found</h3>
                    <p className="text-gray-500">No meals have been logged for this user yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {meals.map(meal => (
                        <div
                            key={meal.mealId}
                            className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-xl shadow-md border border-yellow-100 hover:shadow-lg transition-all duration-300 hover:border-yellow-200 group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-800 group-hover:text-yellow-700 transition-colors">
                                        {meal.mealName}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">User ID: {meal.userId}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    🍽️
                                </div>
                            </div>

                            <div className="bg-red-100 px-4 py-3 rounded-lg text-center mb-4">
                                <p className="text-red-700 font-bold text-2xl">{meal.caloriesConsumed}</p>
                                <p className="text-red-600 text-sm">Calories Consumed</p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Meal ID: {meal.mealId}</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">
                                        {meal.date ? new Date(meal.date).toLocaleDateString() : 'Unknown Date'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Meals;