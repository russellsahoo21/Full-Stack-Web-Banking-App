package com.example.banking.dto;

public record TransferDto(
        Long fromId,
        Long toId,
        Double amount,
        String pin
) {}