package com.financeTracking.Fintrack.TransactionService.Model;

import java.io.Serializable;
import java.util.List;

public class TransactionResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<Transactions> transactions;
    private Integer pageNo;
    private Integer pageSize;
    private Long totalElements;
    private Integer totalPages;
    private boolean lastPage;

    public TransactionResponse(List<Transactions> transactions, Integer pageNo, Integer pageSize, Long totalElements, Integer totalPages, boolean lastPage) {
        this.transactions = transactions;
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.lastPage = lastPage;
    }

    public TransactionResponse() {
    }

    public List<Transactions> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transactions> transactions) {
        this.transactions = transactions;
    }

    public Integer getPageNo() {
        return pageNo;
    }

    public void setPageNo(Integer pageNo) {
        this.pageNo = pageNo;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(Long totalElements) {
        this.totalElements = totalElements;
    }

    public Integer getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(Integer totalPages) {
        this.totalPages = totalPages;
    }

    public boolean isLastPage() {
        return lastPage;
    }

    public void setLastPage(boolean lastPage) {
        this.lastPage = lastPage;
    }
}
