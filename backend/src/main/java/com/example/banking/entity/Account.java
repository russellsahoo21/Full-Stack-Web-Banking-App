package com.example.banking.entity;

import jakarta.persistence.*;

@Table(name = "accounts")
@Entity
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "acc_num_generator")
    @SequenceGenerator(
            name = "acc_num_generator",
            sequenceName = "account_number_seq",
            allocationSize = 1
    )
    private Long id;

    @Column(name = "account_holder_name")
    private String accountHolderName;

    private double balance;

    // The Link: Many accounts belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // 1. No-Args Constructor (Required by JPA)
    public Account() {
    }

    // 2. All-Args Constructor
    public Account(Long id, String accountHolderName, double balance) {
        this.id = id;
        this.accountHolderName = accountHolderName;
        this.balance = balance;
    }

    // 3. Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public void setAccountHolderName(String accountHolderName) {
        this.accountHolderName = accountHolderName;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public void setAccount_holder_name(String username) {
    }
}