package com.example.banking.entity;

import com.example.banking.entity.Account;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "fixed_deposits")
public class FixedDeposit {
    @Id
    private Long id; // We will use your 12-digit random ID logic here too

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account userAccount; // The source account the money came from

    private double maturityAmount;
    private String category;
    private double amount;
    private double interestRate;
    private int durationInMonths;
    private LocalDateTime startDate;
    private LocalDateTime maturityDate;
    private boolean isActive;

    public double getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(double interestRate) {
        this.interestRate = interestRate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Account getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(Account userAccount) {
        this.userAccount = userAccount;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public int getDurationInMonths() {
        return durationInMonths;
    }

    public void setDurationInMonths(int durationInMonths) {
        this.durationInMonths = durationInMonths;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getMaturityDate() {
        return maturityDate;
    }

    public void setMaturityDate(LocalDateTime maturityDate) {
        this.maturityDate = maturityDate;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setMaturityAmount(double maturityAmount) {
    }

    public double getMaturityAmount() {
        return maturityAmount;
    }

    // Standard Constructors, Getters, and Setters
}