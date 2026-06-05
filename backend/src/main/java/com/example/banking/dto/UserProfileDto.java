package com.example.banking.dto;

import java.time.LocalDateTime;
import java.util.List;

public record UserProfileDto(
        String username,
        String email,
        LocalDateTime joinedDate,
        List<AccountDto> accounts
) {}