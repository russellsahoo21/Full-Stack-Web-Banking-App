package com.example.banking.dto;

// Add 'email' here to match your frontend payload
public record RegisterDto(
        String username,
        String password,
        String email
) {}