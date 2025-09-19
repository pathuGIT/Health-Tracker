package com.health.tracker.controller;

import com.health.tracker.entity.Meal;
import com.health.tracker.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meal")
public class MealController {

    @Autowired
    private MealRepository mealRepository;

    @GetMapping
    public List<Meal> getAllMeals() {
        return mealRepository.findAll();
    }

    @PostMapping
    public Meal addMeal(@RequestBody Meal meal) {
        return mealRepository.save(meal);
    }

    @GetMapping("/user/{userId}")
    public List<Meal> getMealsByUser(@PathVariable int userId) {
        return mealRepository.findByUserId(userId);
    }
}