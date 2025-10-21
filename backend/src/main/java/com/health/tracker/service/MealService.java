package com.health.tracker.service;

import com.health.tracker.dto.CaloriSummaryDTO;
import com.health.tracker.dto.UserProfileDTO;
import com.health.tracker.entity.Meal;
import com.health.tracker.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MealService {

    @Autowired
    private MealRepository mealRepository;

    public Meal logMeal(Meal meal) {
        return mealRepository.save(meal);
    }

    public List<Meal> getMealsByUserAndDate(int userId, LocalDate date) {
        return mealRepository.findByUserIdAndDate(userId, date);
    }

    public List<Meal> getMealsByUser(int userId) {
        return mealRepository.findByUserId(userId);
    }

    public Optional<Meal> getMealById(int mealId) {
        return mealRepository.findById(mealId);
    }

    public void deleteMeal(int mealId) {
        mealRepository.deleteById(mealId);
    }

    public Double getTotalCaloriesConsumed(int userId, LocalDate date) {
        return mealRepository.getTotalCaloriesConsumed(userId, date);
    }

    public Map<String, Object> getDailyCalorieIntake(int userId, LocalDate date) {
        CaloriSummaryDTO intake = mealRepository.getDailyCalorieIntake(userId, date);
        Map<String, Object> result = new HashMap<>();
        System.out.println("LLL: "+ userId + "  "+ date + intake);

        if (intake != null) {
            result.put("userId", intake.getUser_id());
            result.put("date", intake.getDate());
            result.put("totalMeals", intake.getToatl_meal());
            result.put("totalCaloriesConsumed", intake.getTotal_calori());
            result.put("avgCaloriesPerMeal", intake.getAvg_calorie_per_meal());
        }

        return result;
    }
}