package com.health.tracker.controller;

import com.health.tracker.entity.Meal;
import com.health.tracker.service.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "*")
public class MealController {

    @Autowired
    private MealService mealService;

    @PostMapping
    public Meal logMeal(@RequestBody Meal meal) {
        return mealService.logMeal(meal);
    }

    @GetMapping("/user/{userId}")
    public List<Meal> getMealsByUser(@PathVariable int userId) {
        return mealService.getMealsByUser(userId);
    }

    @GetMapping("/user/{userId}/date/{date}")
    public List<Meal> getMealsByUserAndDate(
            @PathVariable int userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return mealService.getMealsByUserAndDate(userId, date);
    }

    @GetMapping("/{mealId}")
    public ResponseEntity<Meal> getMealById(@PathVariable int mealId) {
        return mealService.getMealById(mealId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{mealId}")
    public ResponseEntity<Void> deleteMeal(@PathVariable int mealId) {
        mealService.deleteMeal(mealId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}/date/{date}/calories-consumed")
    public ResponseEntity<Map<String, Object>> getTotalCaloriesConsumed(
            @PathVariable int userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Double calories = mealService.getTotalCaloriesConsumed(userId, date);
        Map<String, Object> response = Map.of(
                "userId", userId,
                "date", date,
                "totalCaloriesConsumed", calories != null ? calories : 0.0
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}/date/{date}/summary")
    public ResponseEntity<Map<String, Object>> getDailyCalorieIntake(
            @PathVariable int userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Map<String, Object> intake = mealService.getDailyCalorieIntake(userId, date);
        return ResponseEntity.ok(intake);
    }
}