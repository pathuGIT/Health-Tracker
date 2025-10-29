-- =============================================
-- Health & Fitness Tracker - Advanced Database Objects
-- Created by DatabaseInitializer.java
-- =============================================

-- =============================================
-- 1. INDEXES (For Performance Optimization)
-- =============================================

-- Composite Indexes for main query patterns
CREATE INDEX IF NOT EXISTS idx_exercise_user_date ON exercise(`user_id`, `date`);
CREATE INDEX IF NOT EXISTS idx_meal_user_date ON meal(`user_id`, `date`);
CREATE INDEX IF NOT EXISTS idx_healthmetric_user_date ON health_metric(`user_id`, `date`);

-- Single Column Indexes for individual queries
CREATE INDEX IF NOT EXISTS idx_exercise_user_id ON exercise(`user_id`);
CREATE INDEX IF NOT EXISTS idx_meal_user_id ON meal(`user_id`);
CREATE INDEX IF NOT EXISTS idx_healthmetric_user_id ON health_metric(`user_id`);
CREATE INDEX IF NOT EXISTS idx_exercise_date ON exercise(`date`);
CREATE INDEX IF NOT EXISTS idx_meal_date ON meal(`date`);
CREATE INDEX IF NOT EXISTS idx_healthmetric_date ON health_metric(`date`);

-- =============================================
-- 2. VIEWS (For Data Abstraction & Reporting)
-- =============================================

-- User Profile View: Shows user details with latest BMI
CREATE OR REPLACE VIEW user_profile_view AS
SELECT
    u.user_id,
    u.name,
    u.email,
    u.age,
    u.weight as current_weight,
    u.height,
    hm.BMI as last_bmi_recorded,
    CASE
        WHEN hm.BMI < 18.5 THEN 'Underweight'
        WHEN hm.BMI BETWEEN 18.5 AND 24.9 THEN 'Normal'
        WHEN hm.BMI BETWEEN 25 AND 29.9 THEN 'Overweight'
        ELSE 'Obese'
        END as bmi_category
FROM users u
         LEFT JOIN health_metric hm ON u.user_id = hm.user_id
    AND hm.date = (SELECT MAX(date) FROM health_metric WHERE user_id = u.user_id);

-- Daily Exercise Summary View: Aggregates exercise data
CREATE OR REPLACE VIEW daily_exercise_summary AS
SELECT
    user_id,
    date as exercise_date,
    COUNT(*) as total_exercises,
    SUM(duration_minutes) as total_duration,
    SUM(calories_burned) as total_calories_burned
FROM exercise
GROUP BY user_id, date;

-- Daily Calorie Intake View: Aggregates meal data
CREATE OR REPLACE VIEW daily_calorie_intake AS
SELECT
    user_id,
    date as meal_date,
    COUNT(*) as total_meals,
    SUM(calories_consumed) as total_calories_consumed,
    AVG(calories_consumed) as avg_calories_per_meal
FROM meal
GROUP BY user_id, date;

-- Health Progress View: Shows weight and BMI trends with changes
CREATE OR REPLACE VIEW health_progress_view AS
SELECT
    user_id,
    date,
    weight,
    BMI,
    CASE
    WHEN BMI < 18.5 THEN 'Underweight'
    WHEN BMI BETWEEN 18.5 AND 24.9 THEN 'Normal'
    WHEN BMI BETWEEN 25 AND 29.9 THEN 'Overweight'
    ELSE 'Obese'
END as bmi_category,
    LAG(weight) OVER (PARTITION BY user_id ORDER BY date) as previous_weight,
    weight - LAG(weight) OVER (PARTITION BY user_id ORDER BY date) as weight_change
FROM health_metric;

-- Calories Consumed and Burned View: Joins meal and exercise data
CREATE OR REPLACE VIEW calories_consumed_burned_view AS
SELECT
    m.user_id,
    m.calories_consumed,
    e.calories_burned,
    e.date
FROM meal m
         INNER JOIN exercise e ON m.user_id = e.user_id;

-- =============================================
-- 3. STORED PROCEDURES (For Business Logic)
-- =============================================

-- Drop existing procedures first
DROP PROCEDURE IF EXISTS CalculateUserBMI;
DROP PROCEDURE IF EXISTS GetTotalCaloriesBurned;
DROP PROCEDURE IF EXISTS GetTotalCaloriesConsumed;
DROP FUNCTION IF EXISTS get_user_calorie_summary;

-- Procedure: Calculate User BMI
DELIMITER //
CREATE PROCEDURE CalculateUserBMI(IN p_user_id INT)
BEGIN
    DECLARE user_weight FLOAT;
    DECLARE user_height FLOAT;

SELECT weight, height INTO user_weight, user_height
FROM users WHERE user_id = p_user_id;

IF user_weight IS NOT NULL AND user_height IS NOT NULL THEN
SELECT user_weight / (user_height * user_height) as bmi;
ELSE
SELECT NULL as bmi;
END IF;
END //

-- Procedure: Get Total Calories Burned for a user on specific date
CREATE PROCEDURE GetTotalCaloriesBurned(IN p_user_id INT, IN p_date DATE)
BEGIN
SELECT COALESCE(SUM(calories_burned), 0) as total_calories_burned
FROM exercise
WHERE user_id = p_user_id AND date = p_date;
END //

-- Procedure: Get Total Calories Consumed for a user on specific date
CREATE PROCEDURE GetTotalCaloriesConsumed(IN p_user_id INT, IN p_date DATE)
BEGIN
SELECT COALESCE(SUM(calories_consumed), 0) as total_calories_consumed
FROM meal
WHERE user_id = p_user_id AND date = p_date;
END //

-- =============================================
-- 4. USER DEFINED FUNCTIONS (For Calculations)
-- =============================================

-- Function: Get User Calorie Summary for current day
CREATE FUNCTION get_user_calorie_summary(p_user_id INT)
    RETURNS VARCHAR(255)
    READS SQL DATA
    DETERMINISTIC
BEGIN
    DECLARE total_consumed FLOAT;
    DECLARE total_burned FLOAT;
    DECLARE net_calories FLOAT;
    DECLARE summary VARCHAR(255);

SELECT COALESCE(SUM(calories_consumed), 0) INTO total_consumed
FROM meal
WHERE user_id = p_user_id AND date = CURDATE();

SELECT COALESCE(SUM(calories_burned), 0) INTO total_burned
FROM exercise
WHERE user_id = p_user_id AND date = CURDATE();

SET net_calories = total_consumed - total_burned;

    IF net_calories > 0 THEN
        SET summary = CONCAT('Calorie surplus: ', ROUND(net_calories, 2));
    ELSEIF net_calories < 0 THEN
        SET summary = CONCAT('Calorie deficit: ', ROUND(ABS(net_calories), 2));
ELSE
        SET summary = 'Calorie balance maintained';
END IF;

RETURN summary;
END //

DELIMITER ;

-- =============================================
-- 5. TRIGGERS (For Automated Data Validation)
-- =============================================

-- Drop existing triggers first
DROP TRIGGER IF EXISTS before_health_metric_insert;
DROP TRIGGER IF EXISTS after_meal_insert;

-- Create alerts table for triggers
CREATE TABLE IF NOT EXISTS user_alerts (
                                           alert_id INT AUTO_INCREMENT PRIMARY KEY,
                                           user_id INT NOT NULL,
                                           message VARCHAR(500),
    alert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

-- Trigger: Auto-calculate BMI if not provided
DELIMITER //
CREATE TRIGGER before_health_metric_insert
    BEFORE INSERT ON health_metric
    FOR EACH ROW
BEGIN
    IF NEW.BMI = 0 THEN
        SET NEW.BMI = NEW.weight / (1.75 * 1.75);
END IF;
END //

-- Trigger: Alert when daily calorie limit exceeded
CREATE TRIGGER after_meal_insert
    AFTER INSERT ON meal
    FOR EACH ROW
BEGIN
    DECLARE daily_limit FLOAT DEFAULT 2500;
    DECLARE total_today FLOAT;

    SELECT COALESCE(SUM(calories_consumed), 0) INTO total_today
    FROM meal
    WHERE user_id = NEW.user_id AND date = NEW.date;

    IF total_today > daily_limit THEN
        INSERT INTO user_alerts (user_id, message, alert_date, is_read)
        VALUES (NEW.user_id,
                CONCAT('Daily calorie limit exceeded! Total: ', ROUND(total_today, 2)),
                NOW(), FALSE);
END IF;
END //

DELIMITER ;

-- =============================================
-- 6. VERIFICATION QUERIES (For Demonstration)
-- =============================================

-- Show all created indexes
SELECT
    TABLE_NAME,
    INDEX_NAME,
    GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS COLUMNS,
    INDEX_TYPE
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
  AND INDEX_NAME != 'PRIMARY'
GROUP BY TABLE_NAME, INDEX_NAME, INDEX_TYPE
ORDER BY TABLE_NAME, INDEX_NAME;

-- Show all created views
SELECT
    TABLE_NAME as VIEW_NAME,
    VIEW_DEFINITION
FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME;

-- Show all stored procedures and functions
SELECT
    ROUTINE_NAME,
    ROUTINE_TYPE,
    ROUTINE_DEFINITION
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = DATABASE()
ORDER BY ROUTINE_TYPE, ROUTINE_NAME;

-- Show all triggers
SELECT
    TRIGGER_NAME,
    ACTION_TIMING,
    EVENT_MANIPULATION,
    EVENT_OBJECT_TABLE
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = DATABASE()
ORDER BY TRIGGER_NAME;

-- =============================================
-- 7. TEST QUERIES (For Demonstration)
-- =============================================

-- Test User Profile View
SELECT * FROM user_profile_view WHERE user_id = 1;

-- Test Daily Exercise Summary
SELECT * FROM daily_exercise_summary WHERE user_id = 1 AND exercise_date = CURDATE();

-- Test Daily Calorie Intake
SELECT * FROM daily_calorie_intake WHERE user_id = 1 AND meal_date = CURDATE();

-- Test Health Progress View
SELECT * FROM health_progress_view WHERE user_id = 1 ORDER BY date DESC;

-- Test Calories Consumed/Burned View
SELECT * FROM calories_consumed_burned_view WHERE user_id = 1 LIMIT 5;

-- Test Stored Procedure: Calculate BMI
CALL CalculateUserBMI(1);

-- Test Stored Procedure: Get Calories Burned
CALL GetTotalCaloriesBurned(1, CURDATE());

-- Test Stored Procedure: Get Calories Consumed
CALL GetTotalCaloriesConsumed(1, CURDATE());

-- Test User Defined Function: Get Calorie Summary
SELECT get_user_calorie_summary(1) as calorie_summary;

-- Test Trigger: Insert health metric with BMI=0 (should auto-calculate)
INSERT INTO health_metric (user_id, weight, BMI, date) VALUES (1, 70.0, 0, CURDATE());
SELECT * FROM health_metric WHERE user_id = 1 ORDER BY date DESC LIMIT 1;

-- Test Trigger: Insert meal exceeding calorie limit (should create alert)
INSERT INTO meal (user_id, meal_name, calories_consumed, date) VALUES (1, 'Large Pizza', 2000, CURDATE());
INSERT INTO meal (user_id, meal_name, calories_consumed, date) VALUES (1, 'Burger', 600, CURDATE());
SELECT * FROM user_alerts WHERE user_id = 1 ORDER BY alert_date DESC;

-- =============================================
-- SUMMARY
-- =============================================

SELECT
    'Database Advanced Objects Created Successfully' as status,
    (SELECT COUNT(*) FROM information_schema.VIEWS WHERE TABLE_SCHEMA = DATABASE()) as total_views,
    (SELECT COUNT(*) FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = DATABASE()) as total_procedures_functions,
    (SELECT COUNT(*) FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = DATABASE()) as total_triggers,
    (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND INDEX_NAME != 'PRIMARY') as total_indexes;