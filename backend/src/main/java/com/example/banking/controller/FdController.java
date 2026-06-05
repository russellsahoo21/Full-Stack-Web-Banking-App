package com.example.banking.controller;

import com.example.banking.dto.FdRequestDto;
import com.example.banking.dto.FixedDepositDto;
import com.example.banking.service.FixedDepositService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fd")
public class FdController {

    private final FixedDepositService fdService;

    public FdController(FixedDepositService fdService) {
        this.fdService = fdService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createFd(@RequestBody FdRequestDto fdRequest) {
        String message = fdService.createFixedDeposit(fdRequest);
        return ResponseEntity.ok(message);
    }

    // GET /api/fd/my-fds
    @GetMapping("/my-fds")
    public ResponseEntity<List<FixedDepositDto>> getAllMyFds() {
        return ResponseEntity.ok(fdService.getAllMyFds());
    }

    // GET /api/fd/{id}
    @GetMapping("/{id}")
    public ResponseEntity<FixedDepositDto> getFdById(@PathVariable Long id) {
        return ResponseEntity.ok(fdService.getFdById(id));
    }
}