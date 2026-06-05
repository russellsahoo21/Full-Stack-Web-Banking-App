package com.example.banking.service;

import com.example.banking.dto.UserProfileDto;
import com.example.banking.dto.UserUpdateDto;

public interface UserService {
    UserProfileDto getMyProfile();

    UserProfileDto updateProfile(UserUpdateDto updateDto);

    void setTransactionPin(String pin);

    boolean isTransactionPinSet();

    boolean verifyTransactionPin(String rawPin);
}