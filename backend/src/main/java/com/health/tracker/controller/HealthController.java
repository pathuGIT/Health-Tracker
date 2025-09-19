package com.health.tracker.controller;

import com.health.tracker.entity.*;
import com.health.tracker.repository.UserRepository;
import com.health.tracker.repository.HealthMetricRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HealthMetricRepository healthMetricRepository;

    @PostMapping("/bmi")
    public String updateBMI(@RequestParam int userId, @RequestParam float weight) {
        // This would need to be implemented with your BMI calculation logic
        // For now, we'll just create a simple health metric entry
        HealthMetric metric = new HealthMetric();
        metric.setUserId(userId);
        metric.setWeight(weight);

        // Calculate BMI (assuming height is stored in user profile)
        User user = userRepository.findById(userId).orElse(null);
        if (user != null && user.getHeight() > 0) {
            float heightInMeters = user.getHeight() / 100; // assuming height is in cm
            float bmi = weight / (heightInMeters * heightInMeters);
            metric.setBMI(bmi);
        }

        healthMetricRepository.save(metric);
        return "BMI updated!";
    }
}