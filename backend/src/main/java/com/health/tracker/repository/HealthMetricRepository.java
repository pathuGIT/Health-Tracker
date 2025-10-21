// HealthMetricRepository.java
package com.health.tracker.repository;

import com.health.tracker.entity.HealthMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface HealthMetricRepository extends JpaRepository<HealthMetric, Integer> {

    List<HealthMetric> findByUserIdOrderByDateDesc(int userId);
    HealthMetric findTopByUserIdOrderByDateDesc(int userId);

    @Query(value = "SELECT * FROM health_progress_view WHERE user_id = :userId ORDER BY date DESC", nativeQuery = true)
    List<Object[]> getHealthProgressView(@Param("userId") int userId);
}