package com.example.banking.dto;

import java.time.LocalDateTime;

public record LoanDto(
        Long id,
        String loanType,
        double principalAmount,
        double interestRate,
        double remainingBalance,
        int durationMonths,
        String status,
        LocalDateTime createdAt
) {}