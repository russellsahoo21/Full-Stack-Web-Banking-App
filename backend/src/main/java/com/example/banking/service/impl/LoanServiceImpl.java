package com.example.banking.service.impl;

import com.example.banking.dto.LoanDto;
import com.example.banking.dto.LoanRequestDto;
import com.example.banking.entity.Account;
import com.example.banking.entity.Loan;
import com.example.banking.entity.User;
import com.example.banking.mapper.LoanMapper;
import com.example.banking.repository.AccountRepository;
import com.example.banking.repository.LoanRepository;
import com.example.banking.repository.UserRepository;
import com.example.banking.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public LoanServiceImpl(LoanRepository loanRepository,
                           AccountRepository accountRepository,
                           UserRepository userRepository) {
        this.loanRepository = loanRepository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public LoanDto applyForLoan(LoanRequestDto request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        // 1. Create the Loan Entity
        Loan loan = new Loan();
        loan.setId(generate12DigitId()); // Use your random ID logic
        loan.setUser(user);
        loan.setPrincipalAmount(request.amount());
        loan.setRemainingBalance(request.amount());
        loan.setLoanType(request.loanType());
        loan.setDurationMonths(request.durationMonths());
        loan.setInterestRate(10.5); // Example fixed rate
        loan.setStatus("APPROVED");
        loan.setCreatedAt(LocalDateTime.now());

        // 2. Disbursement: Add money to the specified account
        Account account = accountRepository.findById(request.destinationAccountId()).orElseThrow();
        account.setBalance(account.getBalance() + request.amount());

        loanRepository.save(loan);
        accountRepository.save(account);

        return LoanMapper.mapToLoanDto(loan);
    }

    @Override
    public List<LoanDto> getAllMyLoans() {
        // 1. Get the username from the Security Token
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Fetch from database using the relationship
        List<Loan> loans = loanRepository.findByUser_Username(username);

        // 3. Convert to DTOs
        return loans.stream()
                .map(LoanMapper::mapToLoanDto)
                .collect(Collectors.toList());
    }

    private Long generate12DigitId() {
        return 100_000_000_000L + (long) (Math.random() * 900_000_000_000L);
    }

    @Override
    @Transactional
    public void payEmi(Long loanId, double paymentAmount) {
        Loan loan = loanRepository.findById(loanId).orElseThrow();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Find the user's primary account to deduct money from
        Account account = accountRepository.findAllByAccountHolderName(username).get(0);

        if (account.getBalance() < paymentAmount) {
            throw new RuntimeException("Insufficient balance to pay EMI");
        }

        // Reduce balance from account and remaining loan amount
        account.setBalance(account.getBalance() - paymentAmount);
        loan.setRemainingBalance(loan.getRemainingBalance() - paymentAmount);

        if (loan.getRemainingBalance() <= 0) {
            loan.setStatus("COMPLETED");
        }

        loanRepository.save(loan);
        accountRepository.save(account);
    }
}
