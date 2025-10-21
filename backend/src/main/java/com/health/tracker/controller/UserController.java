package com.health.tracker.controller;

import com.health.tracker.entity.Users;
import com.health.tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, String>> getUser(@PathVariable int userId) {
        Map<String, String> user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Users> updateUser(@PathVariable int userId, @RequestBody Users usersDetails) {
        try {
            Users updatedUsers = userService.updateUser(userId, usersDetails);
            return ResponseEntity.ok(updatedUsers);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{userId}/profile")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserProfile(@PathVariable int userId) {
        Map<String, Object> profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/{userId}/bmi")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, Object>> calculateBMI(@PathVariable int userId) {
        Double bmi = userService.calculateBMI(userId);
        Map<String, Object> response = Map.of(
                "userId", userId,
                "bmi", bmi
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/calorie-summary")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, Object>> getCalorieSummary(@PathVariable int userId) {
        String summary = userService.getCalorieSummary(userId);
        Map<String, Object> response = Map.of(
                "userId", userId,
                "calorieSummary", summary
        );
        return ResponseEntity.ok(response);
    }
}