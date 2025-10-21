package com.health.tracker.controller;

import com.health.tracker.entity.HealthMetric;
import com.health.tracker.service.HealthMetricService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health-metrics")
@CrossOrigin(origins = "*")
public class HealthMetricController {

    @Autowired
    private HealthMetricService healthMetricService;

    @PostMapping()
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public HealthMetric recordHealthMetric(@RequestBody HealthMetric healthMetric) {
        return healthMetricService.recordHealthMetric(healthMetric);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public List<HealthMetric> getHealthMetricsByUser(@PathVariable int userId) {
        return healthMetricService.getHealthMetricsByUser(userId);
    }

    @GetMapping("/user/{userId}/latest")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<HealthMetric> getLatestHealthMetric(@PathVariable int userId) {
        return healthMetricService.getLatestHealthMetric(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}/progress")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public List<Map<String, Object>> getHealthProgress(@PathVariable int userId) {
        return healthMetricService.getHealthProgress(userId);
    }
}