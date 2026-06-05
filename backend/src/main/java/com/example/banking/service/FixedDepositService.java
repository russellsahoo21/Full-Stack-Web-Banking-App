package com.example.banking.service;

import com.example.banking.dto.FdRequestDto;
import com.example.banking.dto.FixedDepositDto;

import java.util.List;

public interface FixedDepositService {
    // This defines the "What" the service does
    String createFixedDeposit(FdRequestDto fdRequest);

    List<FixedDepositDto> getAllMyFds();

    FixedDepositDto getFdById(Long id);
}