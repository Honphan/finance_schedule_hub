package com.demo.repository;

import com.demo.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction, Integer> {
    Transaction findByTransactionId(String transactionId);
}
