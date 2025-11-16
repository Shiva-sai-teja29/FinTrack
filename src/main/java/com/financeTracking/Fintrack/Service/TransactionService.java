package com.financeTracking.Fintrack.Service;

import com.financeTracking.Fintrack.Model.Transactions;
import com.financeTracking.Fintrack.Repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private final TransactionRepository transactionRepo;

    public TransactionService(TransactionRepository transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    public List<Transactions> allTransactions() {
        return transactionRepo.findAll();
    }

    public Transactions addTransaction(Transactions transac) {
        return transactionRepo.save(transac);
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
}
