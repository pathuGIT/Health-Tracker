package com.health.tracker.controller;

import com.health.tracker.entity.User;
import com.health.tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping()
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable int userId) {
        Optional<User> user = userService.getUserById(userId);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable int userId, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(userId, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@PathVariable int userId) {
        Map<String, Object> profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/{userId}/bmi")
    public ResponseEntity<Map<String, Object>> calculateBMI(@PathVariable int userId) {
        Double bmi = userService.calculateBMI(userId);
        Map<String, Object> response = Map.of(
                "userId", userId,
                "bmi", bmi
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/calorie-summary")
    public ResponseEntity<Map<String, Object>> getCalorieSummary(@PathVariable int userId) {
        String summary = userService.getCalorieSummary(userId);
        Map<String, Object> response = Map.of(
                "userId", userId,
                "calorieSummary", summary
        );
        return ResponseEntity.ok(response);
    }
}