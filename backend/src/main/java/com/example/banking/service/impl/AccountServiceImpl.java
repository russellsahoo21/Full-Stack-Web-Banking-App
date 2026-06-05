package com.example.banking.service.impl;

import com.example.banking.dto.AccountDto;
import com.example.banking.dto.FixedDepositDto;
import com.example.banking.dto.TransferDto;
import com.example.banking.entity.Account;
import com.example.banking.entity.Transaction;
import com.example.banking.entity.TransactionType;
import com.example.banking.entity.User;
import com.example.banking.mapper.AccountMapper;
import com.example.banking.repository.AccountRepository;
import com.example.banking.repository.TransactionRepository;
import com.example.banking.repository.UserRepository;
import com.example.banking.service.AccountService;
import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository; // Added final
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountServiceImpl(AccountRepository accountRepository, TransactionRepository transactionRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.transactionRepository=transactionRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AccountDto createAccount(AccountDto accountDto) {
        Account account = AccountMapper.mapToAccount(accountDto);

//        long randomId = (long) (Math.random() * 900_000_000_000L) + 100_000_000_000L;
//        account.setId(randomId);

        Account savedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public AccountDto openAdditionalAccount(String accountType) {
        // 1. Get the currently logged-in user's name
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Create the new Account entity
        Account newAccount = new Account();
        newAccount.setAccountHolderName(username);
        newAccount.setBalance(0.0); // Start with zero
        // You can add an 'accountType' field to your Entity if you want to store "SAVINGS" vs "CURRENT"

        // 3. Generate the 12-digit ID
//        long randomId = 100_000_000_000L + (long) (Math.random() * 900_000_000_000L);
//        newAccount.setId(randomId);

        // 4. Save and return
        Account savedAccount = accountRepository.save(newAccount);
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public List<FixedDepositDto> getAllMyFds() {
        return List.of();
    }

    @Override
    public FixedDepositDto getFdById(Long fdId) {
        return null;
    }

    @Override
    public AccountDto getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account does not exist"));
        return AccountMapper.mapToAccountDto(account);
    }

    @Override
    public AccountDto deposit(Long id, double amount) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account does not exist"));

        double total = account.getBalance() + amount;
        account.setBalance(total);
        Account savedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public AccountDto withdraw(Long id, double amount) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account does not exist"));

        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient amount");
        }

        double total = account.getBalance() - amount;
        account.setBalance(total);
        Account savedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    @Transactional
    public void transferMoney(TransferDto transferDto) {
        // 1. Get the currently logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // We need the User entity to access the stored hashed Transaction PIN
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        // 2. PIN Verification
        // Use passwordEncoder to safely compare the raw PIN from frontend with the hashed PIN in DB
        if (user.getTransactionPin() == null) {
            throw new RuntimeException("Transaction PIN not set. Please set it in Settings.");
        }

        if (!passwordEncoder.matches(transferDto.pin(), user.getTransactionPin())) {
            throw new RuntimeException("Invalid Transaction PIN!");
        }

        // 3. Fetch Accounts
        Account fromAccount = accountRepository.findById(transferDto.fromId())
                .orElseThrow(() -> new RuntimeException("Sender account not found"));

        Account toAccount = accountRepository.findById(transferDto.toId())
                .orElseThrow(() -> new RuntimeException("Receiver account not found"));

        // 4. Ownership Check: Ensure the 'fromAccount' actually belongs to the logged-in user
        if (!fromAccount.getAccountHolderName().equals(username)) {
            throw new RuntimeException("Unauthorized: You do not own the source account.");
        }

        // 5. Balance Check
        if (fromAccount.getBalance() < transferDto.amount()) {
            throw new RuntimeException("Insufficient funds in account: " + fromAccount.getId());
        }

        // 6. Perform the Transfer
        fromAccount.setBalance(fromAccount.getBalance() - transferDto.amount());
        toAccount.setBalance(toAccount.getBalance() + transferDto.amount());

        // 7. Record the Transaction
        Transaction transaction = new Transaction();
        transaction.setSourceAccountId(transferDto.fromId());
        transaction.setTargetAccountId(transferDto.toId());
        transaction.setAmount(transferDto.amount());
        transaction.setType(TransactionType.TRANSFER);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setDescription("Transfer from " + transferDto.fromId() + " to " + transferDto.toId());

        transactionRepository.save(transaction);

        // @Transactional will automatically save fromAccount and toAccount changes at the end
    }

    @Override
    public List<AccountDto> getAllAccounts() {
        // 1. Get the username of the person currently logged in
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Fetch only THEIR accounts
        List<Account> accounts = accountRepository.findAllByAccountHolderName(currentUser);

        // 3. Map to DTOs and return
        return accounts.stream()
                .map(AccountMapper::mapToAccountDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account does not exist"));
        accountRepository.deleteById(id);
    }




}