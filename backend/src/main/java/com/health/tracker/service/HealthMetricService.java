// src/main/java/com/health/tracker/service/HealthMetricService.java
package com.health.tracker.service;

import com.health.tracker.entity.HealthMetric;
import com.health.tracker.repository.HealthMetricRepository;
import com.health.tracker.repository.UserRepository; // NEW IMPORT
import com.health.tracker.entity.Users; // NEW IMPORT
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class HealthMetricService {

    @Autowired
    private HealthMetricRepository healthMetricRepository;

    @Autowired // FIX: Inject UserRepository
    private UserRepository userRepository;

    public HealthMetric recordHealthMetric(HealthMetric healthMetric) {
        // FIX: Retrieve user to get actual height and prepare for weight update
        Users user = userRepository.findById(healthMetric.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Calculate BMI if not provided
        if (healthMetric.getBMI() == 0 && healthMetric.getWeight() > 0) {
            // Use the actual user's height (in cm) converted to meters (m) for calculation
            float heightInMeters = user.getHeight() / 100.0f;

            float bmi = calculateBMI(healthMetric.getWeight(), heightInMeters);
            healthMetric.setBMI(bmi);
        }

        // 1. Save the new metric to the HealthMetric table (history)
        HealthMetric savedMetric = healthMetricRepository.save(healthMetric);

        // 2. FIX: Update the user's current weight in the Users table
        user.setWeight(healthMetric.getWeight());
        userRepository.save(user);

        return savedMetric;
    }

    public List<HealthMetric> getHealthMetricsByUser(int userId) {
        return healthMetricRepository.findByUserIdOrderByDateDesc(userId);
    }

    public Optional<HealthMetric> getLatestHealthMetric(int userId) {
        return Optional.ofNullable(healthMetricRepository.findTopByUserIdOrderByDateDesc(userId));
    }

    public List<Map<String, Object>> getHealthProgress(int userId) {
        List<Object[]> progressData = healthMetricRepository.getHealthProgressView(userId);
        List<Map<String, Object>> progress = new ArrayList<>();

        for (Object[] row : progressData) {
            Map<String, Object> record = new HashMap<>();
            record.put("userId", row[0]);
            record.put("date", row[1]);
            record.put("weight", row[2]);
            record.put("bmi", row[3]);
            record.put("bmiCategory", row[4]);
            // Adjust index for weight_change if needed, assuming it's the 6th element (index 5)
            record.put("weightChange", row.length > 5 ? row[5] : null); // Check array length
            progress.add(record);
        }

        return progress;
    }

    private float calculateBMI(float weight, float heightInMeters) {
        if (heightInMeters <= 0) {
            return 0; // Avoid division by zero
        }
        return weight / (heightInMeters * heightInMeters);
    }

    public List<Map<String, Object>> getCaloriesConsumedBurned(int userId) {
        List<Object[]> caloriesConsumedBurnedView = healthMetricRepository.getCaloriesConsumedBurnedView(userId);
        List<Map<String, Object>> list = new ArrayList<>();

        for (Object[] row : caloriesConsumedBurnedView) {
            Map<String, Object> record = new HashMap<>();
            record.put("userId", row[0]);
            record.put("calories_consumed", row[1]);
            record.put("calories_burned", row[2]);
            // *** ADD THE DATE FIELD HERE ***
            record.put("date", row[3]); // Assuming date is the 4th element (index 3)
            list.add(record);
        }
        return list;
    }
}