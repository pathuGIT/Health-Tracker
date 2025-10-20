package com.health.tracker.controller;

import com.health.tracker.entity.User;
import com.health.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User addUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // --- Authentication Endpoints (NOTE: For proper security, use Spring Security and move these to AuthController) ---

    // Registration Endpoint (POST /api/users/register)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // In a complete implementation, password hashing and validation should occur here.
        User savedUser = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully (Security/password hashing omitted for demo).");
        response.put("userId", savedUser.getUserId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Login Endpoint (POST /api/users/login)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User credentials) {
        // Since User entity doesn't have a password, we only check for email existence for a mock login.
        Optional<User> userOptional = userRepository.findByEmail(credentials.getEmail());

        if (userOptional.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            // Mock JWT Token - A real implementation requires a JWT library and Spring Security
            String mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked.token.for.user." + userOptional.get().getUserId();

            response.put("message", "Login successful (Mock Token Returned).");
            response.put("token", mockToken);
            return ResponseEntity.ok(response);
        } else {
            return new ResponseEntity<>("Invalid credentials (User not found)", HttpStatus.UNAUTHORIZED);
        }
    }
}