package com.health.tracker.repository;

import com.health.tracker.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {

    @Query(value = "SELECT * FROM user_profile_view WHERE user_id = :userId", nativeQuery = true)
    List<Object[]> getUserProfileView(@Param("userId") int userId);

    // Fixed procedure mapping
    @Query(value = "CALL CalculateUserBMI(:userId)", nativeQuery = true)
    Double calculateUserBMI(@Param("userId") int userId);

    @Query(value = "SELECT get_user_calorie_summary(:userId)", nativeQuery = true)
    String getUserCalorieSummary(@Param("userId") int userId);

    Users findByEmail(String username);

    boolean existsByContact(String contact);

    boolean existsByEmail(String email);

    Users findByContact(String loginInput);
}