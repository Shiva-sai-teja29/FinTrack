package com.financeTracking.Fintrack.Controller;

import com.financeTracking.Fintrack.Model.Transactions;
import com.financeTracking.Fintrack.Service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class GreetingController {

    @Autowired
    public TransactionService transactionService;

    public GreetingController(TransactionService transactionService) {
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
    public ResponseEntity<Transactions> addTransaction(@RequestBody Transactions transac){
        Transactions transactions = transactionService.addTransaction(transac);
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
