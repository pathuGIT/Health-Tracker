// MealRepository.java
package com.health.tracker.repository;

import com.health.tracker.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Integer> {
    List<Meal> findByUserId(int userId);
}