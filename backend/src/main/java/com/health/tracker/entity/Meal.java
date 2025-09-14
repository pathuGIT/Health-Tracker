package com.health.tracker.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Meal {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int mealId;
    private int userId;
    private String mealName;
    private float caloriesConsumed;
    private LocalDate date = LocalDate.now();

    // Getters and Setters

    public int getMealId() {
        return mealId;
    }

    public void setMealId(int mealId) {
        this.mealId = mealId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getMealName() {
        return mealName;
    }

    public void setMealName(String mealName) {
        this.mealName = mealName;
    }

    public float getCaloriesConsumed() {
        return caloriesConsumed;
    }

    public void setCaloriesConsumed(float caloriesConsumed) {
        this.caloriesConsumed = caloriesConsumed;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
