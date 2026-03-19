package com.demo.service;

import com.demo.dto.request.TransactionRequest;
import com.demo.entity.Transaction;
import com.demo.repository.TransactionRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {
    private final TransactionRepo transactionRepo;
    public TransactionService(TransactionRepo transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    public ResponseEntity<?> saveTransaction(TransactionRequest request) {
        // Here you would typically convert the TransactionRequest to a Transaction entity,
        // save it using the transactionRepo, and return an appropriate response.
        // For simplicity, we'll just return a success message.
        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setNote(request.getNote());
        transaction.setType(request.getType());
        return ResponseEntity.ok("Transaction saved successfully");
    }

}
