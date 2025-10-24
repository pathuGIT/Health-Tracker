package com.health.tracker.service;

import com.health.tracker.entity.Alert;
import com.health.tracker.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    public List<Alert> getAlertsByUser(int userId) {
        return alertRepository.findByUserIdOrderByAlertDateDesc(userId);
    }
    
    public List<Alert> getUnreadAlertsByUser(int userId) {
        return alertRepository.findByUserIdAndIsReadFalseOrderByAlertDateDesc(userId);
    }

    public Alert markAlertAsRead(int alertId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        
        alert.setIsRead(true);
        return alertRepository.save(alert);
    }
}