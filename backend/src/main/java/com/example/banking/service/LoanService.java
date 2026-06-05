package com.example.banking.service;

import com.example.banking.dto.LoanDto;
import com.example.banking.dto.LoanRequestDto;
import java.util.List;

public interface LoanService {
    LoanDto applyForLoan(LoanRequestDto request);
    List<LoanDto> getAllMyLoans();
    void payEmi(Long id, double amount);
}