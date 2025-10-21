package com.health.tracker.dto;

public class TokenResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Integer userId; // NEW FIELD

    public TokenResponse(String activeToken, String refreshToken, Integer userId) { // UPDATED CONSTRUCTOR
        this.accessToken = activeToken;
        this.refreshToken = refreshToken;
        this.userId = userId;
    }

    // New default constructor needed for Jackson serialization
    public TokenResponse() {
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Integer getUserId() { // NEW GETTER
        return userId;
    }

    public void setUserId(Integer userId) { // NEW SETTER
        this.userId = userId;
    }
}
