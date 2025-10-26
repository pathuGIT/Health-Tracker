package com.health.tracker.repository;

import com.health.tracker.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Admin findByEmail(String username);

    Admin findByContact(String loginInput);
}
