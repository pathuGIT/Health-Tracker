package com.health.tracker.controller;

import com.health.tracker.entity.Users;
import com.health.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.lang.reflect.Method;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public Users addUser(@RequestBody Users user) {
        return userRepository.save(user);
    }

    // --- Authentication Endpoints (NOTE: For proper security, use Spring Security and move these to AuthController) ---

    // Registration Endpoint (POST /api/users/register)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Users user) {
        // In a complete implementation, password hashing and validation should occur here.
        Users savedUser = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully (Security/password hashing omitted for demo).");
        // use helper to avoid assuming a specific getter name
        response.put("userId", extractUserId(savedUser));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Login Endpoint (POST /api/users/login)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Users credentials) {
        // Validate input to avoid NPEs
        if (credentials == null || credentials.getEmail() == null || credentials.getEmail().trim().isEmpty()) {
            return new ResponseEntity<>("Email is required", HttpStatus.BAD_REQUEST);
        }

        String email = credentials.getEmail().trim();

        // Ensure your UserRepository defines: Optional<Users> findByEmail(String email);
        Optional<Users> userOptional = UserRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            // Mock JWT Token - A real implementation requires a JWT library and Spring Security
            String idStr = extractUserId(userOptional.get());
            String mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked.token.for.user." + (idStr != null ? idStr : "unknown");

            response.put("message", "Login successful (Mock Token Returned).");
            response.put("token", mockToken);
            return ResponseEntity.ok(response);
        } else {
            return new ResponseEntity<>("Invalid credentials (User not found)", HttpStatus.UNAUTHORIZED);
        }
    }

    // Helper: try common getter names via reflection to safely obtain the user id without assuming entity method name
    private String extractUserId(Users user) {
        if (user == null) return null;
        try {
            // try getUserId()
            Method m = user.getClass().getMethod("getUserId");
            Object id = m.invoke(user);
            if (id != null) return id.toString();
        } catch (Exception ignored) {}

        try {
            // fallback to getId()
            Method m2 = user.getClass().getMethod("getId");
            Object id2 = m2.invoke(user);
            if (id2 != null) return id2.toString();
        } catch (Exception ignored) {}

        // last resort: try a field named "userId" via getter convention (already covered) or return null
        return null;
    }
}