package com.demo.service;

import com.demo.config.UserPrincipal;
import com.demo.dto.request.TransactionRequest;
import com.demo.dto.response.TransactionResponse;
import com.demo.entity.Category;
import com.demo.entity.Transaction;
import com.demo.entity.User;
import com.demo.repository.CategoryRepo;
import com.demo.repository.TransactionRepo;
import jakarta.persistence.EntityManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {
    private final TransactionRepo transactionRepo;
    private final CategoryRepo categoryRepo;
    private final EntityManager entityManager;

    public TransactionService(TransactionRepo transactionRepo, CategoryRepo categoryRepo, EntityManager entityManager) {
        this.transactionRepo = transactionRepo;
        this.categoryRepo = categoryRepo;
        this.entityManager = entityManager;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> getAllTransactions(UserPrincipal principal) {
        if (principal == null || principal.getId() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        List<Transaction> transaction = transactionRepo.findByUserId(principal.getId());
        if (transaction == null) {
            return ResponseEntity.ok().body("No transactions found");
        }

        List<TransactionResponse> transactionResponse = transaction.stream()
                .map(t -> TransactionResponse.builder()
                        .amount(t.getAmount())
                        .transactionDate(t.getTransactionDate())
                        .note(t.getNote())
                        .type(t.getType())
                        .categoryName(t.getCategory().getType())
                        .build())
                .toList();

        return ResponseEntity.ok(transactionResponse);
    }

    @Transactional
    public ResponseEntity<?> saveTransaction(TransactionRequest request, UserPrincipal principal) {
        if (principal == null || principal.getId() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        if (request.getAmount() == null || request.getAmount() <= 0) {
            return ResponseEntity.badRequest().body("Amount must be greater than 0");
        }

        if (request.getTransactionDate() == null || request.getType() == null) {
            return ResponseEntity.badRequest().body("Transaction date and type are required");
        }

        String categoryType = request.getCategoryName() == null ? "" : request.getCategoryName().trim();
        if (categoryType.isEmpty()) {
            return ResponseEntity.badRequest().body("Category is required");
        }

        Integer userId = principal.getId();
        User userRef = entityManager.getReference(User.class, userId);

        Category category = categoryRepo.findByTypeAndUserId(categoryType, userId)
                .orElseGet(() -> categoryRepo.save(Category.builder()
                        .type(categoryType)
                        .user(userRef)
                        .build()));

        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .transactionDate(request.getTransactionDate())
                .note(request.getNote())
                .type(request.getType())
                .category(category)
                .user(userRef)
                .build();

        transactionRepo.save(transaction);


        return ResponseEntity.status(HttpStatus.CREATED).body("Transaction saved successfully");
    }

}
