package com.example.banking.dto;

public record LoanRepaymentDto(
        double amount,
        String pin
) {}