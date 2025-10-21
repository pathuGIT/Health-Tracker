package com.health.tracker.entity;

import com.health.tracker.dto.Roles;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private int id;

    @NotBlank( message = "name must required")
    private String name;

    private String email;

    @NotBlank( message = "contact must required")
    private String contact;

    @NotBlank( message = "address must required")
    private String address;

    @NotBlank(message = "NIC is required")
    private String nic;

    @Enumerated(EnumType.STRING)
    private Roles role;

    private Boolean active;

    @NotBlank( message = "password must required")
    private String password;

    private String refresh_token;

    public Admin() {
    }

    public Admin(int id, String name, String email, String contact, String address, String nic, Roles role, Boolean active, String password, String refresh_token) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.contact = contact;
        this.address = address;
        this.nic = nic;
        this.role = role;
        this.active = active;
        this.password = password;
        this.refresh_token = refresh_token;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public Roles getRole() {
        return role;
    }

    public void setRole(Roles role) {
        this.role = role;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRefresh_token() {
        return refresh_token;
    }

    public void setRefresh_token(String refresh_token) {
        this.refresh_token = refresh_token;
    }
}
