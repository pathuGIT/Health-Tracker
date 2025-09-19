package com.health.tracker.controller;

import com.health.tracker.entity.HealthMetric;
import com.health.tracker.repository.HealthMetricRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metric")
public class HealthMetricController {

    @Autowired
    private HealthMetricRepository healthMetricRepository;

    @GetMapping
    public List<HealthMetric> getAllMetrics() {
        return healthMetricRepository.findAll();
    }

    @PostMapping
    public HealthMetric addMetric(@RequestBody HealthMetric metric) {
        return healthMetricRepository.save(metric);
    }

    @GetMapping("/user/{userId}")
    public List<HealthMetric> getMetricsByUser(@PathVariable int userId) {
        return healthMetricRepository.findByUserId(userId);
    }
}