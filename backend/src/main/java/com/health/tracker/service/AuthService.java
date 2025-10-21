package com.health.tracker.service;

import com.health.tracker.dto.LoginRequest;
import com.health.tracker.dto.TokenResponse;
import com.health.tracker.dto.UserRegisterResponse;
import com.health.tracker.entity.Admin;
import com.health.tracker.entity.Users;
import com.health.tracker.repository.AdminRepository;
import com.health.tracker.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Transactional
public class AuthService {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    public UserRegisterResponse userRegister(Users users) {
        if(userRepo.existsByEmail(users.getEmail())){
            throw new IllegalArgumentException("This Email already exists.");
        }
        // Assuming contact validation should also be checked (based on the original code logic)
        if(userRepo.existsByContact(users.getContact())){
            throw new IllegalArgumentException("This Contact already exists."); // Corrected error message to be specific
        }

        users.setPassword(bCryptPasswordEncoder.encode(users.getPassword()));

        Users res = userRepo.save(users);
        UserRegisterResponse ur = new UserRegisterResponse(res.getId(), res.getName(), res.getEmail(), res.getContact());
        return ur;
    }

    public TokenResponse verifyUser(LoginRequest loginRequest) {
        // NOTE: authenticationManager.authenticate throws an AuthenticationException (e.g., BadCredentialsException)
        // on failure, so no explicit check for isAuthenticated is required here.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getLogin(), loginRequest.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        // Spring Security roles are prefixed with "ROLE_", so we remove it here.
        String role = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");

        String activeToken = jwtService.generateActiveToken(userDetails.getUsername(), role);
        String refreshToken = jwtService.generateRefreshToken(userDetails.getUsername(), role);
        
        if(refreshToken != null){
            if(role.equals("USER")) {
                Users users = userRepo.findByEmail(userDetails.getUsername());
                if (users != null) {
                    users.setRefresh_token(refreshToken);
                    userRepo.save(users);
                }
            } else if(role.equals("ADMIN")){
                Admin admin = adminRepository.findByEmail(userDetails.getUsername());
                if (admin != null) {
                    admin.setRefresh_token(refreshToken);
                    adminRepository.save(admin);
                }
            }
        }

        return new TokenResponse(activeToken, refreshToken);
    }

    public Map<String, String> getRefreshToken(String refreshToken) {
        try {
            String userLogin = jwtService.extractUserName(refreshToken);
            String role = jwtService.extractRole(refreshToken);

            UserDetails userDetails = User.withUsername(userLogin).password("").roles(role).build();
            if(jwtService.validateToken(refreshToken, userDetails)){
                String newActiveToken = jwtService.generateActiveToken(userLogin, role);
                return Map.of("activeToken", newActiveToken);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        throw new RuntimeException("Error generate refresh token.");
    }

    public Map<String, String> logout(String username, String role) {

        if(role.equals("USER")){
            Users user = userRepo.findByEmail(username);

            if (user != null) {
                user.setRefresh_token(null);
                userRepo.save(user);
                return Map.of("msg", "User "+ username + " successfully logout.");
            }
        }else{
            Admin admin = adminRepository.findByEmail(username);

            if (admin != null) {
                admin.setRefresh_token(null);
                adminRepository.save(admin);
                return Map.of("msg", "Emp "+ username + " successfully logout.");
            }
        }

        throw new RuntimeException("Error Logout.");
    }
}
