// UserService.java
package com.health.tracker.service;

import com.health.tracker.dto.UserProfileDTO;
import com.health.tracker.entity.Users;
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

//    public Users createUser(Users users) {
//        return userRepository.save(users);
//    }

    public Map<String, String> getUserById(int userId) {
        Optional<Users> userResults = userRepository.findById(userId);
        Map<String, String> result = new HashMap<>();

        if (userResults != null && !userResults.isEmpty()) {
            Users user = userResults.get();
            result.put("userId", String.valueOf(user.getId()));
            result.put("name", user.getName());
            result.put("email", user.getEmail());
            result.put("contact", String.valueOf(user.getContact()));
            result.put("age", String.valueOf(user.getAge()));
            result.put("currentWeight", String.valueOf(user.getWeight()));
            result.put("height", String.valueOf(user.getHeight()));
        }

        return result;
    }

    public Users updateUser(int userId, Users usersDetails) {
        Users users = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        users.setName(usersDetails.getName());
        users.setEmail(usersDetails.getEmail());
        users.setAge(usersDetails.getAge());
        users.setWeight(usersDetails.getWeight());
        users.setHeight(usersDetails.getHeight());

        return userRepository.save(users);
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
            Users users = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            result.put("userId", users.getId());
            result.put("name", users.getName());
            result.put("email", users.getEmail());
            result.put("age", users.getAge());
            result.put("currentWeight", users.getWeight());
            result.put("height", users.getHeight());
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