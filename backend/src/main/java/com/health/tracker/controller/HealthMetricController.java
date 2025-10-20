package com.health.tracker.controller;

import com.health.tracker.entity.HealthMetric;
import com.health.tracker.service.HealthMetricService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health-metrics")
@CrossOrigin(origins = "*")
public class HealthMetricController {

    @Autowired
    private HealthMetricService healthMetricService;

    @PostMapping
    public HealthMetric recordHealthMetric(@RequestBody HealthMetric healthMetric) {
        return healthMetricService.recordHealthMetric(healthMetric);
    }

    @GetMapping("/user/{userId}")
    public List<HealthMetric> getHealthMetricsByUser(@PathVariable int userId) {
        return healthMetricService.getHealthMetricsByUser(userId);
    }

    @GetMapping("/user/{userId}/latest")
    public ResponseEntity<HealthMetric> getLatestHealthMetric(@PathVariable int userId) {
        return healthMetricService.getLatestHealthMetric(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}/progress")
    public List<Map<String, Object>> getHealthProgress(@PathVariable int userId) {
        return healthMetricService.getHealthProgress(userId);
    }
}