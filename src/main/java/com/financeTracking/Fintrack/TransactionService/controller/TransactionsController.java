package com.financeTracking.Fintrack.TransactionService.controller;

import com.financeTracking.Fintrack.TransactionService.Model.TransactionDto;
import com.financeTracking.Fintrack.TransactionService.Model.Transactions;
import com.financeTracking.Fintrack.TransactionService.Service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TransactionsController {

    @Autowired
    public TransactionService transactionService;

    public TransactionsController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/greetings")
    public ResponseEntity<String> greetings(){
        return ResponseEntity.ok("This Project is Running");
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transactions>> allTransactions(){
        List<Transactions> transactions = transactionService.allTransactions();
        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/transactions")
    public ResponseEntity<TransactionDto> addTransaction(Authentication authentication, @RequestBody TransactionDto transac){

        TransactionDto transactions = transactionService.addTransaction(transac);
        return new ResponseEntity<>(transactions,HttpStatus.CREATED);
    }

    @PutMapping("/transactions")
    public ResponseEntity<Transactions> updateTransaction(@RequestBody Transactions transac){
        Transactions transactions = transactionService.updateTransaction(transac);
        return new ResponseEntity<>(transactions,HttpStatus.OK);
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<String> updateTransaction(@PathVariable Long id){
        String transactions = transactionService.deleteTransaction(id);
        return new ResponseEntity<>(transactions,HttpStatus.OK);
    }

}
