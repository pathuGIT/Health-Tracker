-- Views
CREATE VIEW user_profile_view AS
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
FROM user u
         LEFT JOIN health_metric hm ON u.user_id = hm.user_id
    AND hm.date = (SELECT MAX(date) FROM health_metric WHERE user_id = u.user_id);

CREATE VIEW daily_exercise_summary AS
SELECT
    user_id,
    date as exercise_date,
    COUNT(*) as total_exercises,
    SUM(duration_minutes) as total_duration,
    SUM(calories_burned) as total_calories_burned
FROM exercise
GROUP BY user_id, date;

CREATE OR daily_calorie_intake AS
SELECT
    user_id,
    date as meal_date,
    COUNT(*) as total_meals,
    SUM(calories_consumed) as total_calories_consumed,
    AVG(calories_consumed) as avg_calories_per_meal
FROM meal
GROUP BY user_id, date;

CREATE OR health_progress_view AS
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

-- Stored Procedures
DELIMITER //
CREATE PROCEDURE CalculateUserBMI(IN p_user_id INT)
BEGIN
    DECLARE user_weight FLOAT;
    DECLARE user_height FLOAT;

SELECT weight, height INTO user_weight, user_height
FROM user WHERE user_id = p_user_id;

IF user_weight IS NOT NULL AND user_height IS NOT NULL THEN
SELECT user_weight / (user_height * user_height) as bmi;
ELSE
SELECT NULL as bmi;
END IF;
END //

CREATE PROCEDURE GetTotalCaloriesBurned(IN p_user_id INT, IN p_date DATE)
BEGIN
SELECT COALESCE(SUM(calories_burned), 0) as total_calories_burned
FROM exercise
WHERE user_id = p_user_id AND date = p_date;
END //

CREATE PROCEDURE GetTotalCaloriesConsumed(IN p_user_id INT, IN p_date DATE)
BEGIN
SELECT COALESCE(SUM(calories_consumed), 0) as total_calories_consumed
FROM meal
WHERE user_id = p_user_id AND date = p_date;
END //

-- User Defined Function
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
        SET summary = CONCAT('Calorie surplus: ', net_calories);
    ELSEIF net_calories < 0 THEN
        SET summary = CONCAT('Calorie deficit: ', ABS(net_calories));
ELSE
        SET summary = 'Calorie balance maintained';
END IF;

RETURN summary;
END //

-- Triggers
CREATE TRIGGER before_health_metric_insert
    BEFORE INSERT ON health_metric
    FOR EACH ROW
BEGIN
    IF NEW.BMI = 0 THEN
        SET NEW.BMI = NEW.weight / (1.75 * 1.75); -- Default height for calculation
END IF;
END //

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
                CONCAT('Daily calorie limit exceeded! Total: ', total_today),
                NOW(), FALSE);
END IF;
END //

DELIMITER ;