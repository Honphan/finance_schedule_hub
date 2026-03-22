package com.demo.dto.response;

import com.demo.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionResponse {
    private Double amount;
    private LocalDate transactionDate;
    private String note;
    private String categoryName;
    private TransactionType type;
}
