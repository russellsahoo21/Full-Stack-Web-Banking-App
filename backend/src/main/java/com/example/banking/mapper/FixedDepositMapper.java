package com.example.banking.mapper;

import com.example.banking.dto.FixedDepositDto;
import com.example.banking.entity.FixedDeposit;

public class FixedDepositMapper {

    // This converts Entity -> DTO (For GET requests)
    public static FixedDepositDto mapToFdDto(FixedDeposit fd) {
        return new FixedDepositDto(
                fd.getId(),
                fd.getUserAccount() != null ? fd.getUserAccount().getId() : null,
                fd.getAmount(),
                fd.getInterestRate(),
                fd.getDurationInMonths(),
                fd.getStartDate(),
                fd.getMaturityDate(),
                fd.isActive()
        );
    }

    // This converts DTO -> Entity (For POST/Create requests)
    public static FixedDeposit mapToFixedDeposit(FixedDepositDto fdDto) {
        FixedDeposit fd = new FixedDeposit(); // Use the Entity class here, not the Dto

        fd.setId(fdDto.id());
        fd.setAmount(fdDto.amount());
        fd.setInterestRate(fdDto.interestRate());
        fd.setDurationInMonths(fdDto.durationInMonths());
        fd.setStartDate(fdDto.startDate());
        fd.setMaturityDate(fdDto.maturityDate());
        fd.setActive(fdDto.isActive());

        return fd;
    }
}