package com.financeTracking.Fintrack.Repository;

import com.financeTracking.Fintrack.Model.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transactions, Long> {

}
