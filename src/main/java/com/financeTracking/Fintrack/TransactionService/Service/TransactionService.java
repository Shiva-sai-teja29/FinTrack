package com.financeTracking.Fintrack.TransactionService.Service;

import com.financeTracking.Fintrack.AuthService.entities.User;
import com.financeTracking.Fintrack.ExceptionHandler.BadRequestException;
import com.financeTracking.Fintrack.ExceptionHandler.ResourceNotFoundException;
import com.financeTracking.Fintrack.ExceptionHandler.UnauthorizedException;
import com.financeTracking.Fintrack.TransactionService.Model.TransactionDto;
import com.financeTracking.Fintrack.TransactionService.Model.TransactionResponse;
import com.financeTracking.Fintrack.TransactionService.Model.Transactions;
import com.financeTracking.Fintrack.TransactionService.Repository.TransactionRepository;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepo;

    public TransactionService(TransactionRepository transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    @Cacheable(cacheNames = "transactions",
            key = "'user:'+#user.id + ':page:' + #pageNo + ':size:' + #pageSize + ':sort:' + #sortBy + ':' + #sortDir + ':search:' + (#search == null || #search.isEmpty() ? 'none' : #search.toLowerCase())")
    public TransactionResponse allTransactions(User user, Integer pageNo, Integer pageSize, String sortBy, String sortDir, String search) {
        if (user == null) {
            throw new UnauthorizedException("User not authenticated");
        }

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize, sort);

        Page<Transactions> transactionsPage;
        if (search == null || search.isEmpty()) {
            transactionsPage = transactionRepo.findByUserId(user.getId(), pageable);
        } else {
            transactionsPage = transactionRepo.findByUserIdAndDescriptionLikeIgnoreCaseOrUserIdAndCategoryLikeIgnoreCase(
                    user.getId(), "%" + search + "%", user.getId(), "%" + search + "%", pageable);
        }

        TransactionResponse response = new TransactionResponse();
        response.setTransactions(transactionsPage.getContent());
        response.setPageNo(transactionsPage.getNumber());
        response.setPageSize(transactionsPage.getSize());
        response.setLastPage(transactionsPage.isLast());
        response.setTotalPages(transactionsPage.getTotalPages());
        response.setTotalElements(transactionsPage.getTotalElements());
        return response;
    }

    @CacheEvict(cacheNames = "transactions", allEntries = true)
    public Transactions getTransactionById(Long id) {
        return transactionRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + id));
    }

    @Transactional
    @CacheEvict(cacheNames = "transactions", allEntries = true)
    public Transactions addTransaction(TransactionDto transac) {
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

        return transactionRepo.save(transaction);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(cacheNames = "transactions", allEntries = true)
    })
    public Transactions updateTransaction(Transactions transac) {
        if (transac.getId() == null) {
            throw new BadRequestException("Transaction ID is required");
        }

        Transactions existingTransaction = transactionRepo.findById(transac.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transac.getId()));

        existingTransaction.setAmount(transac.getAmount());
        existingTransaction.setCategory(transac.getCategory());
        existingTransaction.setDate(transac.getDate());
        existingTransaction.setType(transac.getType());
        existingTransaction.setDescription(transac.getDescription());

        return transactionRepo.save(existingTransaction);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(cacheNames = "transactions", allEntries = true)
    })
    public String deleteTransaction(Long id) {
        Transactions transaction = transactionRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        transactionRepo.delete(transaction);
        return "Deleted Successfully";
    }

    public User extractUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            throw new UnauthorizedException("User not authenticated");
        }
        return (User) auth.getPrincipal();
    }
}
