package com.example.banking.controller;

import com.example.banking.dto.LoanDto;
import com.example.banking.dto.LoanRepaymentDto;
import com.example.banking.dto.LoanRequestDto;
import com.example.banking.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping("/apply")
    public ResponseEntity<LoanDto> apply(@RequestBody LoanRequestDto request) {
        return new ResponseEntity<LoanDto>(loanService.applyForLoan(request), HttpStatus.CREATED);
    }

    @GetMapping("/my-loans")
    public ResponseEntity<List<LoanDto>> getMyLoans() {
        return ResponseEntity.ok(loanService.getAllMyLoans());
    }

    @PostMapping("/{id}/repay")
    public ResponseEntity<String> repay(
            @PathVariable Long id,
            @RequestBody LoanRepaymentDto repaymentRequest // Receives JSON from frontend
    ) {
        // We pass the amount to the service
        loanService.payEmi(id, repaymentRequest.amount());

        // Note: If you want to verify the PIN, you would pass repaymentRequest.pin()
        // to a verification service here before calling payEmi.

        return ResponseEntity.ok("Payment successful! Your balance has been updated.");
    }
}