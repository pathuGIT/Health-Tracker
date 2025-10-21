package com.health.tracker.controller;

import com.health.tracker.entity.Exercise;
import com.health.tracker.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "*")
public class ExerciseController {

    @Autowired
    private ExerciseService exerciseService;

    @PostMapping()
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public Exercise logExercise(@RequestBody Exercise exercise) {
        return exerciseService.logExercise(exercise);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public List<Exercise> getExercisesByUser(@PathVariable int userId) {
        return exerciseService.getExercisesByUser(userId);
    }

    @GetMapping("/user/{userId}/date/{date}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public List<Exercise> getExercisesByUserAndDate(
            @PathVariable int userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return exerciseService.getExercisesByUserAndDate(userId, date);
    }

    @GetMapping("/{exerciseId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Exercise> getExerciseById(@PathVariable int exerciseId) {
        return exerciseService.getExerciseById(exerciseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{exerciseId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteExercise(@PathVariable int exerciseId) {
        exerciseService.deleteExercise(exerciseId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}/date/{date}/calories-burned")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, Object>> getTotalCaloriesBurned(
            @PathVariable int userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Double calories = exerciseService.getTotalCaloriesBurned(userId, date);
        Map<String, Object> response = Map.of(
                "userId", userId,
                "date", date,
                "totalCaloriesBurned", calories != null ? calories : 0.0
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}/date/{date}/summary")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDailyExerciseSummary(
            @PathVariable int userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Map<String, Object> summary = exerciseService.getDailyExerciseSummary(userId, date);
        return ResponseEntity.ok(summary);
    }
}