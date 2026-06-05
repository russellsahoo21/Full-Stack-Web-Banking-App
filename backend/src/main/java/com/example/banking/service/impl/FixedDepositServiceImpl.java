package com.example.banking.service.impl;

import com.example.banking.dto.FdRequestDto;
import com.example.banking.dto.FixedDepositDto;
import com.example.banking.entity.Account;
import com.example.banking.entity.FixedDeposit;
import com.example.banking.mapper.FixedDepositMapper;
import com.example.banking.repository.AccountRepository;
import com.example.banking.repository.FixedDepositRepository;
import com.example.banking.service.FixedDepositService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class FixedDepositServiceImpl implements FixedDepositService {

    private final FixedDepositRepository fdRepository;
    private final AccountRepository accountRepository;

    public FixedDepositServiceImpl(FixedDepositRepository fdRepository, AccountRepository accountRepository) {
        this.fdRepository = fdRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    @Transactional
    public String createFixedDeposit(FdRequestDto fdRequest) {
        // 1. Find the source account
        Account sourceAccount = accountRepository.findById(fdRequest.sourceAccountId())
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        // 2. Check if user has enough balance
        if (sourceAccount.getBalance() < fdRequest.amount()) {
            throw new RuntimeException("Insufficient funds in account to start FD");
        }

        // 3. Deduct money from the main account
        sourceAccount.setBalance(sourceAccount.getBalance() - fdRequest.amount());
        accountRepository.save(sourceAccount);

        // 4. Setup the FD Entity
        FixedDeposit fd = new FixedDeposit();
        fd.setId(generateUnique12DigitId());
        fd.setAmount(fdRequest.amount());

        // 5. Calculate interest rate based on Category and Duration
        double interestRate = calculateInterestRate(fdRequest.durationInMonths(), fdRequest.category());
        fd.setInterestRate(interestRate);
        fd.setCategory(fdRequest.category().toUpperCase()); // Added category field

        fd.setDurationInMonths(fdRequest.durationInMonths());
        fd.setStartDate(LocalDateTime.now());
        fd.setMaturityDate(LocalDateTime.now().plusMonths(fdRequest.durationInMonths()));
        fd.setActive(true);
        fd.setUserAccount(sourceAccount);

        // 6. Calculate Maturity Amount (Simple Interest or Compound)
        double maturityAmount = fdRequest.amount() + (fdRequest.amount() * interestRate * fdRequest.durationInMonths() / (12 * 100));
        fd.setMaturityAmount(maturityAmount);

        fdRepository.save(fd);

        return "FD created successfully! FD ID: " + fd.getId() + " at " + interestRate + "% interest.";
    }

    private double calculateInterestRate(int months, String category) {
        double rate = 6.5; // Base rate for General category

        // Apply Senior Citizen bonus
        if ("SENIOR_CITIZEN".equalsIgnoreCase(category)) {
            rate = 7.0;
        }

        // Optional: You can add duration-based logic too
        if (months >= 36) {
            rate += 0.5; // Add 0.5% if FD is for 3 years or more
        }

        return rate;
    }

    // Helper logic for random 12-digit ID
    private Long generateUnique12DigitId() {
        Random random = new Random();
        long randomId;
        do {
            // Generates a number between 100,000,000,000 and 999,999,999,999
            randomId = 100_000_000_000L + (long) (random.nextDouble() * 900_000_000_000L);
        } while (fdRepository.existsById(randomId));
        return randomId;
    }

//     Simple business logic for interest rates
//    private double calculateInterestRate(int months) {
//        if (months >= 24) return 8.5;
//        if (months >= 12) return 7.5; // 1 year+ get 7.5%
//        if (months >= 6) return 6.0;  // 6 months+ get 6%
//        return 5;                   // Short term get 5%
//    }

    @Override
    public List<FixedDepositDto> getAllMyFds() {
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();

        // Fetch FDs belonging to the logged-in user
        List<FixedDeposit> fds = fdRepository.findByUserAccount_AccountHolderName(currentUser);

        return fds.stream()
                .map(fd -> FixedDepositMapper.mapToFdDto(fd))
                .collect(Collectors.toList());
    }

    @Override
    public FixedDepositDto getFdById(Long fdId) {
        FixedDeposit fd = fdRepository.findById(fdId)
                .orElseThrow(() -> new RuntimeException("Fixed Deposit not found"));

        // Security Check: Ensure the person asking owns this FD
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!fd.getUserAccount().getAccountHolderName().equals(currentUser)) {
            throw new RuntimeException("Access Denied: This is not your FD");
        }

        return FixedDepositMapper.mapToFdDto(fd);
    }
}