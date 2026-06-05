package com.example.banking.service.impl;

import com.example.banking.entity.Transaction;
import com.example.banking.repository.TransactionRepository;
import com.example.banking.service.TransactionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public List<Transaction> getHistoryByAccountId(Long accountId) {
        // This query finds history where the account was either sender or receiver
        return transactionRepository.findBySourceAccountIdOrTargetAccountIdOrderByTimestampDesc(accountId, accountId);
    }
}