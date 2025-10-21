package com.health.tracker.controller;

import com.health.tracker.entity.Users;
import com.health.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Added for @PreAuthorize
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
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')") // Securing the endpoint
    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public Users addUser(@RequestBody Users user) {
        return userRepository.save(user);
    }

    // --- Authentication Endpoints (MOCK LOGIC REMOVED) ---
    // The secure authentication implementation (login/register/refresh) is now only in AuthController.java.

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
