package com.example.banking.repository;

import com.example.banking.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // This exact name is required for Spring Data JPA to generate the SQL
    List<Transaction> findBySourceAccountIdOrTargetAccountIdOrderByTimestampDesc(Long sourceId, Long targetId);
}