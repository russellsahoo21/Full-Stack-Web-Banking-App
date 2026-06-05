package com.example.banking.repository;

import com.example.banking.entity.FixedDeposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FixedDepositRepository extends JpaRepository<FixedDeposit, Long> {

    // Find FDs by the 12-digit account ID
    List<FixedDeposit> findByUserAccount_Id(Long accountId);

    // OR: Find all FDs for a specific user name
    List<FixedDeposit> findByUserAccount_AccountHolderName(String name);

}