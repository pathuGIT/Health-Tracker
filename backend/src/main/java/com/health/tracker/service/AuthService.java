package com.health.tracker.service;

import com.health.tracker.dto.LoginRequest;
import com.health.tracker.dto.TokenResponse;
import com.health.tracker.dto.UserRegisterResponse;
import com.health.tracker.entity.Admin;
import com.health.tracker.entity.Users;
import com.health.tracker.repository.AdminRepository;
import com.health.tracker.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

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
        if(userRepo.existsByContact(users.getContact())){
            throw new IllegalArgumentException("This Contact already exists.");
        }

        users.setPassword(bCryptPasswordEncoder.encode(users.getPassword()));

        Users res = userRepo.save(users);
        UserRegisterResponse ur = new UserRegisterResponse(res.getId(), res.getName(), res.getEmail(), res.getContact());
        return ur;
    }

    public TokenResponse verifyUser(LoginRequest loginRequest) {
        // Authenticate the user. Throws AuthenticationException on failure.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getLogin(), loginRequest.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String login = userDetails.getUsername(); // This is the email/contact
        String role = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");

        // Determine the actual User ID to return to the frontend
        Integer authenticatedUserId = null;
        
        // Find the user entity to get its ID
        if(role.equals("USER")) {
            Users user = userRepo.findByEmail(login);
            if (user == null) {
                user = userRepo.findByContact(login);
            }
            if (user != null) {
                authenticatedUserId = user.getId();
            }
        } else if(role.equals("ADMIN")){
            Admin admin = adminRepository.findByEmail(login);
            if (admin == null) {
                admin = adminRepository.findByContact(login);
            }
            if (admin != null) {
                authenticatedUserId = admin.getId();
            }
        }


        String activeToken = jwtService.generateActiveToken(login, role);
        String refreshToken = jwtService.generateRefreshToken(login, role);

        // Update refresh token in DB
        if(refreshToken != null){
            if(role.equals("USER")) {
                Users user = userRepo.findByEmail(login);
                if (user == null) {
                    user = userRepo.findByContact(login);
                }
                user.setRefresh_token(refreshToken);
                userRepo.save(user);
            } else if(role.equals("ADMIN")){
                Admin admin = adminRepository.findByEmail(login);
                if (admin == null) {
                    admin = adminRepository.findByContact(login);
                }
                admin.setRefresh_token(refreshToken);
                adminRepository.save(admin);
            }
        }

        // Return the authenticatedUserId in the TokenResponse
        return new TokenResponse(activeToken, refreshToken, authenticatedUserId, role);
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
            if (user == null) {
                user = userRepo.findByContact(username);
            }

            if (user != null) {
                user.setRefresh_token(null);
                userRepo.save(user);
                return Map.of("msg", "User "+ username + " successfully logout.");
            }
        }else{
            Admin admin = adminRepository.findByEmail(username);
            if (admin == null) {
                admin = adminRepository.findByContact(username);
            }

            if (admin != null) {
                admin.setRefresh_token(null);
                adminRepository.save(admin);
                return Map.of("msg", "Emp "+ username + " successfully logout.");
            }
        }

        throw new RuntimeException("Error Logout.");
    }

public UserRegisterResponse adminRegister(Admin admin) {
        if(userRepo.existsByEmail(admin.getEmail()) || adminRepository.findByEmail(admin.getEmail()) != null){
            throw new IllegalArgumentException("This Email already exists for a user or admin.");
        }
        if(userRepo.existsByContact(admin.getContact()) || adminRepository.findByContact(admin.getContact()) != null){
            throw new IllegalArgumentException("This Contact already exists for a user or admin.");
        }

        admin.setPassword(bCryptPasswordEncoder.encode(admin.getPassword()));

        Admin res = adminRepository.save(admin);
        // Reusing UserRegisterResponse as it has the same fields needed (id, name, email, contact)
        UserRegisterResponse ar = new UserRegisterResponse(res.getId(), res.getName(), res.getEmail(), res.getContact());
        return ar;
    }
}
