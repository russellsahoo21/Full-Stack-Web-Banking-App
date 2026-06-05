package com.example.banking.dto;

public record FdRequestDto(
        Long sourceAccountId,
        double amount,
        int durationInMonths,
        String category // "GENERAL" or "SENIOR_CITIZEN"
) {}