package com.example.banking.service;

import com.example.banking.entity.Transaction;
import java.util.List;

public interface TransactionService {
    List<Transaction> getHistoryByAccountId(Long accountId);
}