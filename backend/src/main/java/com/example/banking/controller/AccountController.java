package com.example.banking.controller;

import com.example.banking.dto.AccountDto;
import com.example.banking.dto.TransferDto;
import com.example.banking.entity.Transaction;
import com.example.banking.repository.TransactionRepository;
import com.example.banking.service.AccountService;
import com.example.banking.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;
    private final TransactionService transactionService;

    public AccountController(AccountService accountService, TransactionService transactionService) {
        this.accountService = accountService;
        this.transactionService = transactionService;
    }

    // Add Account
    @PostMapping
    public ResponseEntity<AccountDto> addAccount(@RequestBody AccountDto accountDto){
        return new ResponseEntity<>(accountService.createAccount(accountDto), HttpStatus.CREATED);
    }

    // Get Account
    @GetMapping("/{id}")
    public ResponseEntity<AccountDto> getAccountById(@PathVariable Long id){
        AccountDto accountDto = accountService.getAccountById(id);
        return ResponseEntity.ok(accountDto);
    }

    // Deposit
    @PutMapping("/{id}/deposit")
    public ResponseEntity<AccountDto> deposit(@PathVariable Long id, @RequestBody Map<String, Double> request){
        Double amount = request.get("amount");
        AccountDto accountDto = accountService.deposit(id, amount);
        return ResponseEntity.ok(accountDto);
    }

    // Withdraw
    @PutMapping("/{id}/withdraw")
    public ResponseEntity<AccountDto> withdraw(@PathVariable Long id, @RequestBody Map<String, Double> request){
        Double amount = request.get("amount");
        AccountDto accountDto = accountService.withdraw(id, amount);
        return ResponseEntity.ok(accountDto);
    }

    // Get All Accounts
    @GetMapping
    public ResponseEntity<List<AccountDto>> getAllAccounts(){
        List<AccountDto> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }

    // Delete Account
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long id){
        accountService.deleteAccount(id);
        return ResponseEntity.ok("Account is deleted successfully!");
    }

    // Transfer Money
    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@RequestBody TransferDto transferDto) {
        // Pass the DTO directly to the service
        accountService.transferMoney(transferDto);
        return ResponseEntity.ok("Transfer successful!");
    }

    // Account History
    @GetMapping("/{id}/transactions")
    public ResponseEntity<List<Transaction>> getStatement(@PathVariable Long id) {
        List<Transaction> history = transactionService.getHistoryByAccountId(id);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/open-new")
    public ResponseEntity<AccountDto> openExtraAccount(@RequestBody String type) {
        // 1. Get logged-in user from SecurityContext
        // 2. Generate a NEW 12-digit ID
        // 3. Save to database linked to that user
        return ResponseEntity.ok(accountService.openAdditionalAccount(type));
    }
}