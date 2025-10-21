package com.health.tracker.config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        // Change this to the password you want for your Admin (e.g., "adminpassword")
        String plaintextPassword = "Admin1234"; 

        // Use the same strength (12) as configured in SecureConfig/AuthService
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String hashedPassword = encoder.encode(plaintextPassword);
        
        System.out.println("Plaintext Password: " + plaintextPassword);
        System.out.println("BCrypt Hash: " + hashedPassword);
    }
}
