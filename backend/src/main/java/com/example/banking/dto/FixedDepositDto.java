package com.example.banking.dto;

import java.time.LocalDateTime;

public record FixedDepositDto(
        Long id,
        Long accountId,
        double amount,
        double interestRate,
        int durationInMonths,
        LocalDateTime startDate,
        LocalDateTime maturityDate,
        boolean isActive
) {
}
// Count them: 1, 2, 3, 4, 5, 6, 7, 8. Now it matches!