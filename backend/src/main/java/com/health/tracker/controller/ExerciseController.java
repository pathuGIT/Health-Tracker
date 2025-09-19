package com.health.tracker.controller;

import com.health.tracker.entity.Exercise;
import com.health.tracker.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercise")
public class ExerciseController {

    @Autowired
    private ExerciseRepository exerciseRepository;

    @GetMapping
    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    @PostMapping
    public Exercise addExercise(@RequestBody Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    @GetMapping("/user/{userId}")
    public List<Exercise> getExercisesByUser(@PathVariable int userId) {
        return exerciseRepository.findByUserId(userId);
    }
}