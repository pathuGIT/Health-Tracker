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

DELIMITER //
CREATE PROCEDURE UpdateBMI(IN uid INT, IN newWeight FLOAT)
BEGIN
    DECLARE h FLOAT;
SELECT height INTO h FROM User WHERE user_id = uid;
INSERT INTO HealthMetric(user_id, date, weight, BMI)
VALUES(uid, CURDATE(), newWeight, newWeight/(h*h))
    ON DUPLICATE KEY UPDATE weight=newWeight, BMI=newWeight/(h*h);
END //
DELIMITER ;

DELIMITER //

CREATE TRIGGER CalorieLimitAlert
    AFTER INSERT ON Meal
    FOR EACH ROW
BEGIN
    DECLARE totalCalories FLOAT;

    -- Sum calories for the current user for today
    SELECT SUM(calories_consumed) INTO totalCalories
    FROM Meal
    WHERE user_id = NEW.user_id AND DATE(date) = CURDATE();

    -- Check if total exceeds 2000
    IF totalCalories > 2000 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Daily calorie limit exceeded!';
END IF;
END;
//

DELIMITER ;


ALTER TABLE Exercise MODIFY date DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Meal MODIFY date DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE HealthMetric MODIFY date DATETIME DEFAULT CURRENT_TIMESTAMP;

