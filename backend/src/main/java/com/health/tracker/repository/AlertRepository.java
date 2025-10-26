package com.health.tracker.repository;

import com.health.tracker.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Integer> {
    List<Alert> findByUserIdOrderByAlertDateDesc(int userId);
    List<Alert> findByUserIdAndIsReadFalseOrderByAlertDateDesc(int userId);
}