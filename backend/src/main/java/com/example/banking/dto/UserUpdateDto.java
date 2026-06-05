package com.example.banking.dto;

public record UserUpdateDto(
        String mobileNumber,
        String address,
        String dob,
        String gender,
        String occupation
) {}