package com.health.tracker.controller;

import com.health.tracker.dto.*;
import com.health.tracker.entity.Users;
import com.health.tracker.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.AuthenticationException; // <-- NEW IMPORT

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> userRegister(@Valid @RequestBody Users users, BindingResult result){
        if (result.hasErrors()) {
            // Collect error messages
            List<String> errors = result.getAllErrors()
                    .stream()
                    .map(ObjectError::getDefaultMessage)
                    .toList();

            return ResponseEntity.badRequest().body(new ApiResponse<List<String>>("Empty fields..", errors));
        }

        try {
            users.setRole(UserRole.USER);
            users.setActive(true);

            UserRegisterResponse res = authService.userRegister(users);
            ApiResponse<UserRegisterResponse> response = new ApiResponse<>();
            response.setMessage("User registered successfully!");
            response.setData(res);
            return ResponseEntity.ok(response);


        } catch (IllegalArgumentException ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<String>(ex.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<String>("An unexpected error occurred", null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest){
        System.out.println("un: "+ loginRequest.getLogin());
        try {
            TokenResponse response = authService.verifyUser(loginRequest);
            return ResponseEntity.ok(new ApiResponse<TokenResponse>("User Login Successfull.", response ));
        } catch (AuthenticationException ex) { // <-- CATCH SPECIFIC AUTHENTICATION ERRORS
            // Authentication failures like BadCredentialsException (wrong password)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<String>("Error Login", "Invalid login credentials."));
        } catch (IllegalArgumentException ex) {
            // Bad request: invalid username/password or user not found (if thrown specifically by logic)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<String>("Error Login", ex.getMessage()));
        } catch (Exception ex) {
            // Internal server error for truly unexpected cases
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<String>("An unexpected error occurred: " + ex.getMessage(), null));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request){
        try {
            String refreshToken = request.get("refreshToken");
            System.out.println(refreshToken);
            Map<String, String> res =  authService.getRefreshToken(refreshToken);
            System.out.println(res);
            return ResponseEntity.ok(new ApiResponse<Map<String, String>>("success", res));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<String>("failed", e.getMessage()));
        }
    }

    @PutMapping("/logout")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> logout(Authentication authentication) {
        // `authentication` will be filled by Spring Security from your JWT
        String username = authentication.getName(); // usually the email/contact (subject)
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        System.out.println("Logout user: " + username + " | Role: " + role);

        try {
            Map<String, String> res = authService.logout(username, role);
            return ResponseEntity.ok(new ApiResponse<>("Logout successful", res));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Error Logout", ex.getMessage()));
        }
    }
}
