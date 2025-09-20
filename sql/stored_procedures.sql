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