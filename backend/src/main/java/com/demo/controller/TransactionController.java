package com.demo.controller;

import com.demo.config.UserPrincipal;
import com.demo.dto.request.TransactionRequest;
import com.demo.service.TransactionService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<?> getAllTransactions(@AuthenticationPrincipal UserPrincipal principal) {
        return transactionService.getAllTransactions(principal);
    }

    @PostMapping
    public ResponseEntity<?> saveTransaction(
            @RequestBody TransactionRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return transactionService.saveTransaction(request, principal);
    }
}
