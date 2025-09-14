//package com.health.tracker.controller;
//
//import com.health.tracker.entity.User;
//import com.health.tracker.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/users")
//public class UserController {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    // Get all users


//    @GetMapping
//    public List<User> getAllUsers() {
//        return userRepository.findAll();
//    }
//
//    // Add a new user
//    @PostMapping
//    public User addUser(@RequestBody User user) {
//        return userRepository.save(user);
//    }
//}
