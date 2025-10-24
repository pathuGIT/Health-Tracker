package com.health.tracker.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Initializing advanced database objects...");

        try {
            createIndexes();

            // Execute views first
            createViews();

            // Execute stored procedures and functions
            createStoredProceduresAndFunctions();

            // Execute triggers
            createTriggers();

            //create index
            createIndexes();

            System.out.println("Advanced database objects initialized successfully");
        } catch (Exception e) {
            System.err.println("Error initializing database objects: " + e.getMessage());
        }
    }

    private void createViews() {
        String[] viewStatements = {
                // User Profile View
                "CREATE OR REPLACE VIEW user_profile_view AS " +
                        "SELECT " +
                        "    u.user_id, " +
                        "    u.name, " +
                        "    u.email, " +
                        "    u.age, " +
                        "    u.weight as current_weight, " +
                        "    u.height, " +
                        "    hm.BMI as last_bmi_recorded, " +
                        "    CASE " +
                        "        WHEN hm.BMI < 18.5 THEN 'Underweight' " +
                        "        WHEN hm.BMI BETWEEN 18.5 AND 24.9 THEN 'Normal' " +
                        "        WHEN hm.BMI BETWEEN 25 AND 29.9 THEN 'Overweight' " +
                        "        ELSE 'Obese' " +
                        "    END as bmi_category " +
                        "FROM users u " +
                        "LEFT JOIN health_metric hm ON u.user_id = hm.user_id " +
                        "AND hm.date = (SELECT MAX(date) FROM health_metric WHERE user_id = u.user_id)",

                // Daily Exercise Summary View
                "CREATE OR REPLACE VIEW daily_exercise_summary AS " +
                        "SELECT " +
                        "    user_id, " +
                        "    date as exercise_date, " +
                        "    COUNT(*) as total_exercises, " +
                        "    SUM(duration_minutes) as total_duration, " +
                        "    SUM(calories_burned) as total_calories_burned " +
                        "FROM exercise " +
                        "GROUP BY user_id, date",

                // Daily Calorie Intake View
                "CREATE OR REPLACE VIEW daily_calorie_intake AS " +
                        "SELECT " +
                        "    user_id, " +
                        "    date as meal_date, " +
                        "    COUNT(*) as total_meals, " +
                        "    SUM(calories_consumed) as total_calories_consumed, " +
                        "    AVG(calories_consumed) as avg_calories_per_meal " +
                        "FROM meal " +
                        "GROUP BY user_id, date",

                // Health Progress View
                "CREATE OR REPLACE VIEW health_progress_view AS " +
                        "SELECT " +
                        "    user_id, " +
                        "    date, " +
                        "    weight, " +
                        "    BMI, " +
                        "    CASE " +
                        "        WHEN BMI < 18.5 THEN 'Underweight' " +
                        "        WHEN BMI BETWEEN 18.5 AND 24.9 THEN 'Normal' " +
                        "        WHEN BMI BETWEEN 25 AND 29.9 THEN 'Overweight' " +
                        "        ELSE 'Obese' " +
                        "    END as bmi_category, " +
                        "    LAG(weight) OVER (PARTITION BY user_id ORDER BY date) as previous_weight, " +
                        "    weight - LAG(weight) OVER (PARTITION BY user_id ORDER BY date) as weight_change " +
                        "FROM health_metric"
        };

        for (String view : viewStatements) {
            try {
                jdbcTemplate.execute(view);
                System.out.println("View created successfully");
            } catch (Exception e) {
                System.out.println("View might already exist: " + e.getMessage());
            }
        }
    }

    private void createStoredProceduresAndFunctions() {
        // Drop procedures if they exist
        String[] dropStatements = {
                "DROP PROCEDURE IF EXISTS CalculateUserBMI",
                "DROP PROCEDURE IF EXISTS GetTotalCaloriesBurned",
                "DROP PROCEDURE IF EXISTS GetTotalCaloriesConsumed",
                "DROP FUNCTION IF EXISTS get_user_calorie_summary"
        };

        for (String dropStmt : dropStatements) {
            try {
                jdbcTemplate.execute(dropStmt);
            } catch (Exception e) {
                // Ignore drop errors
            }
        }

        // Create stored procedures and functions
        try {
            // CalculateUserBMI Procedure
            String calculateBMIProc =
                    "CREATE PROCEDURE CalculateUserBMI(IN p_user_id INT) " +
                            "BEGIN " +
                            "    DECLARE user_weight FLOAT; " +
                            "    DECLARE user_height FLOAT; " +
                            "    SELECT weight, height INTO user_weight, user_height " +
                            "    FROM users WHERE user_id = p_user_id; " +
                            "    IF user_weight IS NOT NULL AND user_height IS NOT NULL THEN " +
                            "        SELECT user_weight / (user_height * user_height) as bmi; " +
                            "    ELSE " +
                            "        SELECT NULL as bmi; " +
                            "    END IF; " +
                            "END";
            jdbcTemplate.execute(calculateBMIProc);
            System.out.println("Stored procedure CalculateUserBMI created");

            // GetTotalCaloriesBurned Procedure
            String caloriesBurnedProc =
                    "CREATE PROCEDURE GetTotalCaloriesBurned(IN p_user_id INT, IN p_date DATE) " +
                            "BEGIN " +
                            "    SELECT COALESCE(SUM(calories_burned), 0) as total_calories_burned " +
                            "    FROM exercise " +
                            "    WHERE user_id = p_user_id AND date = p_date; " +
                            "END";
            jdbcTemplate.execute(caloriesBurnedProc);
            System.out.println("Stored procedure GetTotalCaloriesBurned created");

            // GetTotalCaloriesConsumed Procedure
            String caloriesConsumedProc =
                    "CREATE PROCEDURE GetTotalCaloriesConsumed(IN p_user_id INT, IN p_date DATE) " +
                            "BEGIN " +
                            "    SELECT COALESCE(SUM(calories_consumed), 0) as total_calories_consumed " +
                            "    FROM meal " +
                            "    WHERE user_id = p_user_id AND date = p_date; " +
                            "END";
            jdbcTemplate.execute(caloriesConsumedProc);
            System.out.println("Stored procedure GetTotalCaloriesConsumed created");

            // User Defined Function
            String calorieSummaryFunc =
                    "CREATE FUNCTION get_user_calorie_summary(p_user_id INT) " +
                            "RETURNS VARCHAR(255) " +
                            "READS SQL DATA " +
                            "DETERMINISTIC " +
                            "BEGIN " +
                            "    DECLARE total_consumed FLOAT; " +
                            "    DECLARE total_burned FLOAT; " +
                            "    DECLARE net_calories FLOAT; " +
                            "    DECLARE summary VARCHAR(255); " +
                            "    SELECT COALESCE(SUM(calories_consumed), 0) INTO total_consumed " +
                            "    FROM meal " +
                            "    WHERE user_id = p_user_id AND date = CURDATE(); " +
                            "    SELECT COALESCE(SUM(calories_burned), 0) INTO total_burned " +
                            "    FROM exercise " +
                            "    WHERE user_id = p_user_id AND date = CURDATE(); " +
                            "    SET net_calories = total_consumed - total_burned; " +
                            "    IF net_calories > 0 THEN " +
                            "        SET summary = CONCAT('Calorie surplus: ', ROUND(net_calories, 2)); " +
                            "    ELSEIF net_calories < 0 THEN " +
                            "        SET summary = CONCAT('Calorie deficit: ', ROUND(ABS(net_calories), 2)); " +
                            "    ELSE " +
                            "        SET summary = 'Calorie balance maintained'; " +
                            "    END IF; " +
                            "    RETURN summary; " +
                            "END";
            jdbcTemplate.execute(calorieSummaryFunc);
            System.out.println("Function get_user_calorie_summary created");

        } catch (Exception e) {
            System.err.println("Error creating procedures/functions: " + e.getMessage());
        }
    }

    private void createTriggers() {
        // Drop triggers if they exist
        String[] dropTriggers = {
                "DROP TRIGGER IF EXISTS before_health_metric_insert",
                "DROP TRIGGER IF EXISTS after_meal_insert"
        };

        for (String dropTrigger : dropTriggers) {
            try {
                jdbcTemplate.execute(dropTrigger);
            } catch (Exception e) {
                // Ignore drop errors
            }
        }

        try {
            // Create alerts table for triggers
            String createAlertsTable =
                    "CREATE TABLE IF NOT EXISTS user_alerts (" +
                            "    alert_id INT AUTO_INCREMENT PRIMARY KEY, " +
                            "    user_id INT NOT NULL, " +
                            "    message VARCHAR(500), " +
                            "    alert_date DATETIME DEFAULT CURRENT_TIMESTAMP, " +
                            "    is_read BOOLEAN DEFAULT FALSE, " +
                            "    FOREIGN KEY (user_id) REFERENCES users(user_id)" +
                            ")";
            jdbcTemplate.execute(createAlertsTable);
            System.out.println("User alerts table created/verified");

            // Before health metric insert trigger
            String healthMetricTrigger =
                    "CREATE TRIGGER before_health_metric_insert " +
                            "BEFORE INSERT ON health_metric " +
                            "FOR EACH ROW " +
                            "BEGIN " +
                            "    IF NEW.BMI = 0 THEN " +
                            "        SET NEW.BMI = NEW.weight / (1.75 * 1.75); " +
                            "    END IF; " +
                            "END";
            jdbcTemplate.execute(healthMetricTrigger);
            System.out.println("Trigger before_health_metric_insert created");

            // After meal insert trigger
            String mealTrigger =
                    "CREATE TRIGGER after_meal_insert " +
                            "AFTER INSERT ON meal " +
                            "FOR EACH ROW " +
                            "BEGIN " +
                            "    DECLARE daily_limit FLOAT DEFAULT 2500; " +
                            "    DECLARE total_today FLOAT; " +
                            "    SELECT COALESCE(SUM(calories_consumed), 0) INTO total_today " +
                            "    FROM meal " +
                            "    WHERE user_id = NEW.user_id AND date = NEW.date; " +
                            "    IF total_today > daily_limit THEN " +
                            "        INSERT INTO user_alerts (user_id, message, alert_date, is_read) " +
                            "        VALUES (NEW.user_id, " +
                            "                CONCAT('Daily calorie limit exceeded! Total: ', ROUND(total_today, 2)), " +
                            "                NOW(), FALSE); " +
                            "    END IF; " +
                            "END";
            jdbcTemplate.execute(mealTrigger);
            System.out.println("Trigger after_meal_insert created");

        } catch (Exception e) {
            System.err.println("Error creating triggers: " + e.getMessage());
        }
    }

    private void createIndexes() {
        System.out.println(" Creating indexes...");

        String[] indexStatements = {
                // Critical indexes for your main queries
                "CREATE INDEX IF NOT EXISTS idx_meal_user_date ON meal(user_id, date)",
                "CREATE INDEX IF NOT EXISTS idx_exercise_user_date ON exercise(user_id, date)",
                "CREATE INDEX IF NOT EXISTS idx_healthmetric_user_date ON health_metric(user_id, date)",

                // Optional but helpful indexes
                "CREATE INDEX IF NOT EXISTS idx_user_email ON users(email)",
                "CREATE INDEX IF NOT EXISTS idx_meal_date ON meal(date)",
                "CREATE INDEX IF NOT EXISTS idx_exercise_date ON exercise(date)"
        };

        for (String indexSql : indexStatements) {
            try {
                jdbcTemplate.execute(indexSql);
                System.out.println(" " + getIndexName(indexSql));
            } catch (Exception e) {
                System.out.println(" Failed: " + getIndexName(indexSql) + " - " + e.getMessage());
            }
        }
    }

    private String getIndexName(String sql) {
        return sql.replace("CREATE INDEX IF NOT EXISTS ", "").split(" ")[0];
    }


}