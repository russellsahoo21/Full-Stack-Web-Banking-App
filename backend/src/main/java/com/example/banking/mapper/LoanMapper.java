package com.example.banking.mapper;

import com.example.banking.dto.LoanDto;
import com.example.banking.entity.Loan;

public class LoanMapper {
    public static LoanDto mapToLoanDto(Loan loan) {
        return new LoanDto(
                loan.getId(),
                loan.getLoanType(),
                loan.getPrincipalAmount(),
                loan.getInterestRate(),
                loan.getRemainingBalance(),
                loan.getDurationMonths(),
                loan.getStatus(),
                loan.getCreatedAt()
        );
    }
}