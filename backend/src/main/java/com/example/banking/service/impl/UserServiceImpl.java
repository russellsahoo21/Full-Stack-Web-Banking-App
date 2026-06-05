package com.example.banking.service.impl;

import com.example.banking.dto.AccountDto;
import com.example.banking.dto.UserProfileDto;
import com.example.banking.dto.UserUpdateDto;
import com.example.banking.entity.Account;
import com.example.banking.entity.User;
import com.example.banking.mapper.AccountMapper;
import com.example.banking.repository.AccountRepository;
import com.example.banking.repository.UserRepository;
import com.example.banking.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository; // Add this
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserProfileDto getMyProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Fetch ALL accounts belonging to this user
        // (Assuming you have findByAccountHolderName returning a List now)
        List<Account> accounts = accountRepository.findAllByAccountHolderName(username);

        // 2. Convert the List of Entities to a List of DTOs
        List<AccountDto> accountDtos = accounts.stream()
                .map(account -> AccountMapper.mapToAccountDto(account))
                .collect(Collectors.toList());

        // 3. Pass the 4 required arguments to the record
        return new UserProfileDto(
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt(),
                accountDtos // This matches the "java.util.List" requirement
        );
    }

    @Override
    public UserProfileDto updateProfile(UserUpdateDto updateDto) {
        // 1. Get current logged-in user from token
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Update the fields
        user.setMobileNumber(updateDto.mobileNumber());
        user.setAddress(updateDto.address());
        user.setDob(updateDto.dob());
        user.setGender(updateDto.gender());
        user.setOccupation(updateDto.occupation());

        // 3. Save the updated user
        User updatedUser = userRepository.save(user);

        // 4. Return the full profile (using your existing DTO)
        return new UserProfileDto(
                updatedUser.getUsername(),
                updatedUser.getEmail(),
                updatedUser.getCreatedAt(),
                // Map your accounts list here as we did in the previous step
                user.getAccounts().stream().map(AccountMapper::mapToAccountDto).toList()
        );
    }

    @Override
    public void setTransactionPin(String rawPin) {
        // 1. Get the current user from the Security Context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Hash the PIN using PasswordEncoder (same as you do for passwords)
        String hashedPin = passwordEncoder.encode(rawPin);

        // 3. Save to User entity
        user.setTransactionPin(hashedPin);
        userRepository.save(user);
    }

    @Override
    public boolean isTransactionPinSet() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If the field is not null and not empty, a PIN exists
        return user.getTransactionPin() != null && !user.getTransactionPin().isEmpty();
    }

    @Override
    public boolean verifyTransactionPin(String rawPin) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getTransactionPin() == null) {
            throw new RuntimeException("No Transaction PIN has been set for this account.");
        }

        // CRITICAL: Use .matches() to compare raw input with the Bcrypt hash
        return passwordEncoder.matches(rawPin, user.getTransactionPin());
    }


}