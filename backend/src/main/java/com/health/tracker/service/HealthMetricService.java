package com.health.tracker.service;

import com.health.tracker.entity.HealthMetric;
import com.health.tracker.repository.HealthMetricRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class HealthMetricService {

    @Autowired
    private HealthMetricRepository healthMetricRepository;

    public HealthMetric recordHealthMetric(HealthMetric healthMetric) {
        // Calculate BMI if not provided
        if (healthMetric.getBMI() == 0 && healthMetric.getWeight() > 0) {
            // This would typically get user height from user service
            // For demo, assuming height is available
            float bmi = calculateBMI(healthMetric.getWeight(), 1.75f); // Default height
            healthMetric.setBMI(bmi);
        }
        return healthMetricRepository.save(healthMetric);
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
            record.put("weightChange", row[5]);
            progress.add(record);
        }

        return progress;
    }

    private float calculateBMI(float weight, float height) {
        return weight / (height * height);
    }
}