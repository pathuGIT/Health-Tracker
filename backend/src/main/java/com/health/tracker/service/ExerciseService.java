package com.health.tracker.service;

import com.health.tracker.dto.DailyExerciseSummaryDTO;
import com.health.tracker.entity.Exercise;
import com.health.tracker.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ExerciseService {

    @Autowired
    private ExerciseRepository exerciseRepository;

    public Exercise logExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    public List<Exercise> getExercisesByUserAndDate(int userId, LocalDate date) {
        return exerciseRepository.findByUserIdAndDate(userId, date);
    }

    public List<Exercise> getExercisesByUser(int userId) {
        return exerciseRepository.findByUserId(userId);
    }

    public Optional<Exercise> getExerciseById(int exerciseId) {
        return exerciseRepository.findById(exerciseId);
    }

    public void deleteExercise(int exerciseId) {
        exerciseRepository.deleteById(exerciseId);
    }

    public Double getTotalCaloriesBurned(int userId, LocalDate date) {
        return exerciseRepository.getTotalCaloriesBurned(userId, date);
    }

    public Map<String, Object> getDailyExerciseSummary(int userId, LocalDate date) {
        DailyExerciseSummaryDTO summary = exerciseRepository.getDailyExerciseSummary(userId, date);
        Map<String, Object> result = new HashMap<>();

        if (summary != null) {
            result.put("userId", summary.getUser_id());
            result.put("date", summary.getDate());
            result.put("totalExercises", summary.getToatl_exercise());
            result.put("totalDuration", summary.getTotal_duration());
            result.put("totalCaloriesBurned", summary.getTotal_calories_burned());
        }

        return result;
    }
}