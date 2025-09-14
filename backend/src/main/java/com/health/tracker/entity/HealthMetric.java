package com.health.tracker.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class HealthMetric {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int metricId;
    private int userId;
    private LocalDate date = LocalDate.now();
    private float weight;
    private float BMI;

    // Getters and Setters

    public int getMetricId() {
        return metricId;
    }

    public void setMetricId(int metricId) {
        this.metricId = metricId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public float getWeight() {
        return weight;
    }

    public void setWeight(float weight) {
        this.weight = weight;
    }

    public float getBMI() {
        return BMI;
    }

    public void setBMI(float BMI) {
        this.BMI = BMI;
    }
}
