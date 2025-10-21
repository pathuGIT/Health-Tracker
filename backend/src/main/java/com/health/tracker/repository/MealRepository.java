// MealRepository.java
package com.health.tracker.repository;

import com.health.tracker.dto.CaloriSummaryDTO;
import com.health.tracker.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Integer> {

    List<Meal> findByUserIdAndDate(int userId, LocalDate date);
    List<Meal> findByUserId(int userId);

    @Query(value = "SELECT * FROM daily_calorie_intake WHERE user_id = :userId AND meal_date = :date", nativeQuery = true)
    CaloriSummaryDTO getDailyCalorieIntake(@Param("userId") int userId, @Param("date") LocalDate date);

    // Fixed procedure mapping
    @Query(value = "CALL GetTotalCaloriesConsumed(:userId, :date)", nativeQuery = true)
    Double getTotalCaloriesConsumed(@Param("userId") int userId, @Param("date") LocalDate date);
}