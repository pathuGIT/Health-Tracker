import { useEffect, useState } from "react";
import { getMealsByUser } from "../services/MealService"; // <-- use service

const DEMO_USER_ID = 1; // or get from props/context

const Meals = () => {
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        getMealsByUser(DEMO_USER_ID)
            .then(res => setMeals(res.data))
            .catch(err => console.error("Error fetching meals:", err));
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Meals</h2>
            <div className="space-y-4">
                {meals.map(meal => (
                    <div key={meal.mealId} className="bg-yellow-50 p-5 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="font-semibold text-lg">{meal.mealName}</h3>
                        <p>User ID: {meal.userId}</p>
                        <p>Calories: {meal.caloriesConsumed}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Meals;
