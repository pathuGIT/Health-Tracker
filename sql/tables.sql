-- Create database
CREATE DATABASE IF NOT EXISTS health_tracker;
USE health_tracker;

-- Create User table
CREATE TABLE User (
                      user_id INT AUTO_INCREMENT PRIMARY KEY,
                      name VARCHAR(50) NOT NULL,
                      email VARCHAR(50) UNIQUE NOT NULL,
                      age INT,
                      weight FLOAT,
                      height FLOAT
);

-- Create Exercise table
CREATE TABLE Exercise (
                          exercise_id INT AUTO_INCREMENT PRIMARY KEY,
                          user_id INT NOT NULL,
                          exercise_name VARCHAR(50) NOT NULL,
                          duration_minutes INT,
                          calories_burned FLOAT,
                          date DATETIME DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Create Meal table
CREATE TABLE Meal (
                      meal_id INT AUTO_INCREMENT PRIMARY KEY,
                      user_id INT NOT NULL,
                      meal_name VARCHAR(50) NOT NULL,
                      calories_consumed FLOAT,
                      date DATETIME DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Create HealthMetric table
CREATE TABLE HealthMetric (
                              metric_id INT AUTO_INCREMENT PRIMARY KEY,
                              user_id INT NOT NULL,
                              date DATETIME DEFAULT CURRENT_TIMESTAMP,
                              weight FLOAT,
                              BMI FLOAT,
                              FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);






ALTER TABLE Exercise MODIFY date DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Meal MODIFY date DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE HealthMetric MODIFY date DATETIME DEFAULT CURRENT_TIMESTAMP;

