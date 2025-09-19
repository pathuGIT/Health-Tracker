// HealthMetricRepository.java
package com.health.tracker.repository;

import com.health.tracker.entity.HealthMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HealthMetricRepository extends JpaRepository<HealthMetric, Integer> {
    List<HealthMetric> findByUserId(int userId);
}