// ExerciseRepository.java
package com.health.tracker.repository;

import com.health.tracker.dto.DailyExerciseSummaryDTO;
import com.health.tracker.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {

    List<Exercise> findByUserIdAndDate(int userId, LocalDate date);
    List<Exercise> findByUserId(int userId);
    

    @Query(value = "SELECT * FROM daily_exercise_summary WHERE user_id = :userId AND exercise_date = :date", nativeQuery = true)
    DailyExerciseSummaryDTO getDailyExerciseSummary(@Param("userId") int userId, @Param("date") LocalDate date);

    // Fixed procedure mapping
    @Query(value = "CALL GetTotalCaloriesBurned(:userId, :date)", nativeQuery = true)
    Double getTotalCaloriesBurned(@Param("userId") int userId, @Param("date") LocalDate date);
}