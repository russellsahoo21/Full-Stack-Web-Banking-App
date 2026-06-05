package com.example.banking.controller;

import com.example.banking.dto.UserProfileDto;
import com.example.banking.dto.UserUpdateDto;
import com.example.banking.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    // PUT /api/users/profile
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(@RequestBody UserUpdateDto updateDto) {
        UserProfileDto updatedProfile = userService.updateProfile(updateDto);
        return ResponseEntity.ok(updatedProfile);
    }

    @PatchMapping("/set-pin")
    public ResponseEntity<String> updateTransactionPin(@RequestBody Map<String, String> request) {
        String pin = request.get("pin");
        if (pin == null || pin.length() < 4) {
            return ResponseEntity.badRequest().body("PIN must be at least 4 digits");
        }
        userService.setTransactionPin(pin);
        return ResponseEntity.ok("Transaction PIN updated successfully");
    }

    @GetMapping("/pin-status")
    public ResponseEntity<Map<String, Boolean>> getPinStatus() {
        boolean isSet = userService.isTransactionPinSet();
        return ResponseEntity.ok(Map.of("isPinSet", isSet));
    }

    @PostMapping("/verify-pin")
    public ResponseEntity<Map<String, Object>> verifyPin(@RequestBody Map<String, String> request) {
        String pin = request.get("pin");
        boolean isValid = userService.verifyTransactionPin(pin);

        if (isValid) {
            return ResponseEntity.ok(Map.of("valid", true, "message", "PIN Verified"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "message", "Incorrect PIN"));
        }
    }

}