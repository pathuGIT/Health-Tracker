package com.health.tracker.service;

import com.health.tracker.dto.LoadUser;
import com.health.tracker.dto.LoadUserRole;
import com.health.tracker.entity.Admin;
import com.health.tracker.entity.Users;
import com.health.tracker.repository.AdminRepository;
import com.health.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String loginInput) throws UsernameNotFoundException {

        LoadUser loadUser = null;

        if (loginInput.contains("@")) {
            // Email login
            Users user = userRepo.findByEmail(loginInput);
            if (user != null) {
                loadUser = mapToLoadUser(user);
            } else {
                Admin admin = adminRepository.findByEmail(loginInput);
                if (admin != null) {
                    loadUser = mapToLoadUser(admin);
                }
            }
        } else {
            // Contact login
            Users user = userRepo.findByContact(loginInput);
            if (user != null) {
                loadUser = mapToLoadUser(user);
            } else {
                Admin admin = adminRepository.findByContact(loginInput);
                if (admin != null) {
                    loadUser = mapToLoadUser(admin);
                }
            }
        }

        if (loadUser == null) {
            throw new UsernameNotFoundException("User not found with: " + loginInput);
        }

        System.out.println("Authenticated user: " + (loadUser.getEmail() != null ? loadUser.getEmail() : loadUser.getContact()));

        return User.builder()
                .username(loadUser.getEmail() != null ? loadUser.getEmail() : loadUser.getContact())
                //.username(String.valueOf(loadUser.getId()))
                .password(loadUser.getPassword())
                .roles(String.valueOf(loadUser.getRole()))
                .build();
    }

    //  Helper methods to reduce repetition
    private LoadUser mapToLoadUser(Users user) {
        LoadUser loadUser = new LoadUser();
        loadUser.setId(user.getId());
        loadUser.setEmail(user.getEmail());
        loadUser.setContact(user.getContact());
        loadUser.setRole(LoadUserRole.valueOf(user.getRole().name()));
        loadUser.setPassword(user.getPassword());
        loadUser.setRefresh_token(user.getRefresh_token());
        return loadUser;
    }

    private LoadUser mapToLoadUser(Admin admin) {
        LoadUser loadUser = new LoadUser();
        loadUser.setId(admin.getId());
        loadUser.setEmail(admin.getEmail());
        loadUser.setContact(admin.getContact());
        loadUser.setRole(LoadUserRole.valueOf(admin.getRole().name()));
        loadUser.setPassword(admin.getPassword());
        loadUser.setRefresh_token(admin.getRefresh_token());
        return loadUser;
    }
}
