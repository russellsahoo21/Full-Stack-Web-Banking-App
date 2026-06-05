package com.example.banking.service;

import com.example.banking.dto.AccountDto;
import com.example.banking.dto.FixedDepositDto;
import com.example.banking.dto.TransferDto;

import java.util.List;

public interface AccountService {
    AccountDto createAccount(AccountDto accountDto);
    AccountDto getAccountById(Long id);
    AccountDto deposit(Long id, double amount);
    AccountDto withdraw(Long id, double amount);
    void transferMoney(TransferDto transferDto);
    List<AccountDto> getAllAccounts();
    void deleteAccount(Long id);

    AccountDto openAdditionalAccount(String accountType);

    List<FixedDepositDto> getAllMyFds();
    FixedDepositDto getFdById(Long fdId);
}