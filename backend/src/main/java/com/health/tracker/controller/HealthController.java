package com.health.tracker.controller;

import com.health.tracker.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired
    private JdbcTemplate jdbc;

    @PostMapping("/users")
    public String addUser(@RequestBody User user){
        jdbc.update("INSERT INTO User(name,email,age,weight,height) VALUES(?,?,?,?,?)",
                user.getName(), user.getEmail(), user.getAge(), user.getWeight(), user.getHeight());
        return "User added!";
    }

    @PostMapping("/exercise")
    public String addExercise(@RequestBody Exercise ex){
        jdbc.update("INSERT INTO Exercise(user_id, exercise_name, duration_minutes, calories_burned) VALUES(?,?,?,?)",
                ex.getUserId(), ex.getExerciseName(), ex.getDurationMinutes(), ex.getCaloriesBurned());
        return "Exercise logged!";
    }

    @PostMapping("/meal")
    public String addMeal(@RequestBody Meal meal){
        jdbc.update("INSERT INTO Meal(user_id, meal_name, calories_consumed) VALUES(?,?,?)",
                meal.getUserId(), meal.getMealName(), meal.getCaloriesConsumed());
        return "Meal logged!";
    }

    @PostMapping("/bmi")
    public String updateBMI(@RequestParam int userId, @RequestParam float weight){
        jdbc.update("CALL UpdateBMI(?, ?)", userId, weight);
        return "BMI updated!";
    }
}
