package com.health.tracker.dto;

import java.time.LocalDate;
import java.util.Date;

public class CaloriSummaryDTO {
    private int user_id;
    private Date date;
    private Long toatl_meal;
    private double total_calori;
    private double avg_calorie_per_meal;

    public CaloriSummaryDTO(int user_id, Date date, Long toatl_meal, double total_calori, double avg_calorie_per_meal) {
        this.user_id = user_id;
        this.date = date;
        this.toatl_meal = toatl_meal;
        this.total_calori = total_calori;
        this.avg_calorie_per_meal = avg_calorie_per_meal;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Long getToatl_meal() {
        return toatl_meal;
    }

    public void setToatl_meal(Long toatl_meal) {
        this.toatl_meal = toatl_meal;
    }

    public double getTotal_calori() {
        return total_calori;
    }

    public void setTotal_calori(double total_calori) {
        this.total_calori = total_calori;
    }

    public double getAvg_calorie_per_meal() {
        return avg_calorie_per_meal;
    }

    public void setAvg_calorie_per_meal(double avg_calorie_per_meal) {
        this.avg_calorie_per_meal = avg_calorie_per_meal;
    }
}
