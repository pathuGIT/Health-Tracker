package com.health.tracker.controller;

import com.health.tracker.entity.Alert;
import com.health.tracker.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public List<Alert> getAlertsByUser(@PathVariable int userId) {
        return alertService.getAlertsByUser(userId);
    }
    
    @GetMapping("/user/{userId}/unread")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public List<Alert> getUnreadAlertsByUser(@PathVariable int userId) {
        return alertService.getUnreadAlertsByUser(userId);
    }

    @PutMapping("/{alertId}/read")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Alert> markAlertAsRead(@PathVariable int alertId) {
        try {
            Alert updatedAlert = alertService.markAlertAsRead(alertId);
            return ResponseEntity.ok(updatedAlert);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}