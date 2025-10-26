package com.health.tracker.dto;

public class UserProfileDTO {
    private Integer userId;
    private String name;
    private String email;
    private Integer age;
    private Float currentWeight;
    private Float height;
    private Float lastBMIRecorded;
    private String bmiCategory;

    // Constructor for view results
    public UserProfileDTO(Object[] row) {
        if (row != null && row.length >= 8) {
            this.userId = row[0] != null ? ((Number) row[0]).intValue() : null;
            this.name = (String) row[1];
            this.email = (String) row[2];
            this.age = row[3] != null ? ((Number) row[3]).intValue() : null;
            this.currentWeight = row[4] != null ? ((Number) row[4]).floatValue() : null;
            this.height = row[5] != null ? ((Number) row[5]).floatValue() : null;
            this.lastBMIRecorded = row[6] != null ? ((Number) row[6]).floatValue() : null;
            this.bmiCategory = (String) row[7];
        }
    }

    // Getters and Setters
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public Float getCurrentWeight() { return currentWeight; }
    public void setCurrentWeight(Float currentWeight) { this.currentWeight = currentWeight; }

    public Float getHeight() { return height; }
    public void setHeight(Float height) { this.height = height; }

    public Float getLastBMIRecorded() { return lastBMIRecorded; }
    public void setLastBMIRecorded(Float lastBMIRecorded) { this.lastBMIRecorded = lastBMIRecorded; }

    public String getBmiCategory() { return bmiCategory; }
    public void setBmiCategory(String bmiCategory) { this.bmiCategory = bmiCategory; }
}