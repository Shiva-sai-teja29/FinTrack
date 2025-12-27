package com.financeTracking.Fintrack.TransactionService.Service;

import com.financeTracking.Fintrack.AuthService.entities.User;
import com.financeTracking.Fintrack.AuthService.Repository.UserRepository;
import com.financeTracking.Fintrack.ExceptionHandler.BadRequestException;
import com.financeTracking.Fintrack.ExceptionHandler.ResourceNotFoundException;
import com.financeTracking.Fintrack.ExceptionHandler.UnauthorizedException;
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

    private final TransactionRepository transactionRepo;


    @Autowired
    public TransactionService(TransactionRepository transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    public List<Transactions> allTransactions(User user) {
        if (user == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        return transactionRepo.findByUserId(user.getId());
    }

    @Transactional
    public TransactionDto addTransaction(TransactionDto transac) {
        if (transac == null) {
            throw new BadRequestException("Transaction data cannot be null");
        }
        User user = extractUser();
        Transactions transaction = new Transactions();
        transaction.setAmount(transac.getAmount());
        transaction.setDate(transac.getDate());
        transaction.setCategory(transac.getCategory());
        transaction.setDescription(transac.getDescription());
        transaction.setType(transac.getType());
        transaction.setUser(user);
        transaction.setHasReceipt(false);
        List<Transactions> transactions = user.getTransactions();
        transactions.add(transaction);
        user.setTransactions(transactions);
        transactionRepo.save(transaction);
        return transac;
    }

    public Transactions updateTransaction(Transactions transac) {
        if (transac.getId() == null) {
            throw new BadRequestException("Transaction ID is required");
        }

        Transactions existingTransaction = transactionRepo.findById(transac.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Transaction not found with id: " + transac.getId()
                        )
                );
            existingTransaction.setAmount(transac.getAmount());
            existingTransaction.setCategory(transac.getCategory());
            existingTransaction.setDate(transac.getDate());
            existingTransaction.setType(transac.getType());
            existingTransaction.setDescription(transac.getDescription());
            return transactionRepo.save(existingTransaction);

    }
    @Transactional
    public String deleteTransaction(Long id) {
        Transactions transaction = transactionRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Transaction not found with id: " + id
                        )
                );

        transactionRepo.delete(transaction);

        return "Deleted Successfully";

    }
    public User extractUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || auth.getPrincipal().equals("anonymousUser")) {
            throw new UnauthorizedException("User not authenticated");
        }
        return (User) auth.getPrincipal();
    }
}
