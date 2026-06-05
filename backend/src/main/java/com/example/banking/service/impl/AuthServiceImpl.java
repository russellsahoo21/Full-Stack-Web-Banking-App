package com.example.banking.service.impl;

import com.example.banking.dto.LoginDto;
import com.example.banking.dto.RegisterDto;
import com.example.banking.entity.Account;
import com.example.banking.entity.User;
import com.example.banking.repository.AccountRepository;
import com.example.banking.repository.UserRepository;
import com.example.banking.security.JwtProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl{

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final JwtProvider jwtProvider;

    public AuthServiceImpl(UserRepository userRepository, AccountRepository accountRepository, JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.jwtProvider = jwtProvider;
    }

    // Inside AuthServiceImpl.java
    public String login(LoginDto loginDto) {
        User user = userRepository.findByUsername(loginDto.getUsername()) // using record style
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getPassword().equals(loginDto.getPassword())) {
            // CALL THE TOKEN GENERATOR HERE
            return jwtProvider.generateToken(user.getUsername());
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }


    @Transactional
    public String register(RegisterDto registerDto) {
        // 1. Safety check
        if (userRepository.findByUsername(registerDto.username()).isPresent()) {
            throw new RuntimeException("User already exists!");
        }

        // 2. Create User
        User user = new User();
        user.setUsername(registerDto.username());
        user.setPassword(registerDto.password()); // Assuming plain text for now
        user.setEmail(registerDto.email());

        // Save user first to clear the persistence context for this object
        userRepository.saveAndFlush(user);

        // 3. Create Account
        Account account = new Account();
        account.setAccountHolderName(user.getUsername());
        account.setBalance(0.0);

        // ABSOLUTELY NO setId() here.
        // If you have ANY line like 'account.setId(...)', DELETE IT.

        accountRepository.save(account);

        return "Success";
    }


}