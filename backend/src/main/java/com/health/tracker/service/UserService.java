// UserService.java
package com.health.tracker.service;

import com.health.tracker.dto.UserProfileDTO;
import com.health.tracker.entity.User;
import com.health.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserById(int userId) {
        return userRepository.findById(userId);
    }

    public User updateUser(int userId, User userDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setAge(userDetails.getAge());
        user.setWeight(userDetails.getWeight());
        user.setHeight(userDetails.getHeight());

        return userRepository.save(user);
    }

    public Map<String, Object> getUserProfile(int userId) {
        List<Object[]> profileResults = userRepository.getUserProfileView(userId);
        Map<String, Object> result = new HashMap<>();

        if (profileResults != null && !profileResults.isEmpty()) {
            Object[] profile = profileResults.get(0);
            UserProfileDTO dto = new UserProfileDTO(profile);

            result.put("userId", dto.getUserId());
            result.put("name", dto.getName());
            result.put("email", dto.getEmail());
            result.put("age", dto.getAge());
            result.put("currentWeight", dto.getCurrentWeight());
            result.put("height", dto.getHeight());
            result.put("lastBMIRecorded", dto.getLastBMIRecorded() != null ? dto.getLastBMIRecorded() : "Not recorded");
            result.put("bmiCategory", dto.getBmiCategory() != null ? dto.getBmiCategory() : "Not calculated");
        } else {
            // Fallback to basic user data
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            result.put("userId", user.getUserId());
            result.put("name", user.getName());
            result.put("email", user.getEmail());
            result.put("age", user.getAge());
            result.put("currentWeight", user.getWeight());
            result.put("height", user.getHeight());
            result.put("lastBMIRecorded", "Not recorded");
            result.put("bmiCategory", "Not calculated");
        }

        return result;
    }

    public Double calculateBMI(int userId) {
        return userRepository.calculateUserBMI(userId);
    }

    public String getCalorieSummary(int userId) {
        return userRepository.getUserCalorieSummary(userId);
    }
}