package com.demo.controller;

import com.demo.dto.request.TransactionRequest;
import com.demo.service.TransactionService;
import org.aspectj.lang.annotation.DeclareWarning;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<?> saveTransaction(@RequestBody TransactionRequest request) {
        return transactionService.saveTransaction(request);
    }
}
