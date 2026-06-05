package com.example.banking.dto;

public record LoanRequestDto(
        double amount,
        String loanType,
        int durationMonths,
        Long destinationAccountId // Which account should receive the money?
) {}
