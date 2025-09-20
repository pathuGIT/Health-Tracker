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