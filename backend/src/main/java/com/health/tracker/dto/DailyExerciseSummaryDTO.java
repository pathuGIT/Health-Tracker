package com.health.tracker.dto;

import java.math.BigDecimal;
import java.util.Date;

public class DailyExerciseSummaryDTO {
    private int user_id;
    private Date date;
    private Long toatl_exercise;
    private BigDecimal total_duration;
    private double total_calories_burned;

    public DailyExerciseSummaryDTO(int user_id, Date date, Long toatl_exercise, BigDecimal total_duration, double total_calories_burned) {
        this.user_id = user_id;
        this.date = date;
        this.toatl_exercise = toatl_exercise;
        this.total_duration = total_duration;
        this.total_calories_burned = total_calories_burned;
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

    public Long getToatl_exercise() {
        return toatl_exercise;
    }

    public void setToatl_exercise(Long toatl_exercise) {
        this.toatl_exercise = toatl_exercise;
    }

    public BigDecimal getTotal_duration() {
        return total_duration;
    }

    public void setTotal_duration(BigDecimal total_duration) {
        this.total_duration = total_duration;
    }

    public double getTotal_calories_burned() {
        return total_calories_burned;
    }

    public void setTotal_calories_burned(double total_calories_burned) {
        this.total_calories_burned = total_calories_burned;
    }
}
