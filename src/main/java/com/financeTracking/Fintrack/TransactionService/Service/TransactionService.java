package com.financeTracking.Fintrack.TransactionService.Service;

import com.financeTracking.Fintrack.AuthService.entities.User;
import com.financeTracking.Fintrack.AuthService.Repository.UserRepository;
import com.financeTracking.Fintrack.TransactionService.Model.TransactionDto;
import com.financeTracking.Fintrack.TransactionService.Model.Transactions;
import com.financeTracking.Fintrack.TransactionService.Repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private final TransactionRepository transactionRepo;
    @Autowired
    private UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    public List<Transactions> allTransactions() {
        return transactionRepo.findAll();
    }

    @Transactional
    public TransactionDto addTransaction(TransactionDto transac) {
        User user = extractUser();
        Transactions transaction = new Transactions();
        transaction.setAmount(transac.getAmount());
        transaction.setDate(transac.getDate());
        transaction.setCategory(transac.getCategory());
        transaction.setDescription(transac.getDescription());
        transaction.setType(transac.getType());
        transaction.setUser(user);
        List<Transactions> transactions = user.getTransactions();
        transactions.add(transaction);
        user.setTransactions(transactions);
        transactionRepo.save(transaction);
        return transac;
    }

    public Transactions updateTransaction(Transactions transac) {
        Optional<Transactions> newTransaction = transactionRepo.findById(transac.getId());
        if (newTransaction.isPresent()){
            Transactions existingTransaction = newTransaction.get();
            existingTransaction.setAmount(transac.getAmount());
            existingTransaction.setCategory(transac.getCategory());
            existingTransaction.setDate(transac.getDate());
            existingTransaction.setType(transac.getType());
            existingTransaction.setDescription(transac.getDescription());

            return transactionRepo.save(existingTransaction);
        }
        return null;
    }

    public String deleteTransaction(Long id) {
        Optional<Transactions> newTransaction = transactionRepo.findById(id);
        if (newTransaction.isPresent()){
            transactionRepo.deleteById(id);
            return "Deleted Successfully";
        }
        return "Transaction not found";
    }
    public User extractUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return user;
    }
}
