package com.demo.dto.request;

import com.demo.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionRequest {
    private Double amount;
    private LocalDate transactionDate;
    private String note;
    private TransactionType type;
    private String categoryName;
}
