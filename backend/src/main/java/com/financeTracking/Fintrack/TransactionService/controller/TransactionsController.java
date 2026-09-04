package com.financeTracking.Fintrack.TransactionService.controller;

import com.financeTracking.Fintrack.AuthService.entities.User;
import com.financeTracking.Fintrack.TransactionService.Model.TransactionDto;
import com.financeTracking.Fintrack.TransactionService.Model.TransactionResponse;
import com.financeTracking.Fintrack.TransactionService.Model.Transactions;
import com.financeTracking.Fintrack.TransactionService.Service.DownloadService;
import com.financeTracking.Fintrack.TransactionService.Service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TransactionsController {

    @Autowired
    public TransactionService transactionService;
    @Autowired
    public DownloadService downloadService;

    public TransactionsController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/greetings")
    public ResponseEntity<String> greetings(){
        return ResponseEntity.ok("This Project is Running");
    }

    @GetMapping("/transactions")
    public ResponseEntity<TransactionResponse> allTransactions(
            @RequestParam(required = false, defaultValue = "1") Integer pageNo,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize,
            @RequestParam(required = false, defaultValue = "date") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            Authentication authentication){

        User user = extractUser();
        TransactionResponse transactions = transactionService
                .allTransactions(user, pageNo, pageSize, sortBy, sortDir, search);
        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/transactions")
    public ResponseEntity<Transactions> addTransaction(Authentication authentication, @RequestBody TransactionDto transac){

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

    @GetMapping("/transactions/export/csv")
    public ResponseEntity<InputStreamResource> exportCSV(
            @RequestParam String startMonth,
            @RequestParam String endMonth
    ){
        List<TransactionDto> data = transactionService.getTransactionsByMonthRange(startMonth,endMonth);
        ByteArrayInputStream csv = downloadService.generateCsv(data);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=transactions.csv");
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(csv));
    }

    @GetMapping("/transactions/export/excel")
    public ResponseEntity<InputStreamResource> exportExcel(
            @RequestParam String startMonth,
            @RequestParam String endMonth) throws Exception {
        List<TransactionDto> data =
                transactionService.getTransactionsByMonthRange(startMonth, endMonth);

        ByteArrayInputStream excel = downloadService.generateExcel(data);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=transactions.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(excel));
    }

    public User extractUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (User) auth.getPrincipal();
    }
}
