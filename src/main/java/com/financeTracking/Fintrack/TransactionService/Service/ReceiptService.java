package com.financeTracking.Fintrack.TransactionService.Service;

import com.financeTracking.Fintrack.TransactionService.Model.Transactions;
import com.financeTracking.Fintrack.TransactionService.Repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ReceiptService {

    private static final String UPLOAD_DIR = "uploads/receipts/";

    @Autowired
    private TransactionRepository transactionRepository;

    public Transactions uploadReceipt(Long transactionId, Long userId, MultipartFile file) throws IOException {

        Transactions tx = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Create directory if not exists
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) dir.mkdirs();

        // Generate unique file name
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path filePath = Paths.get(UPLOAD_DIR + filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Save path in DB
        tx.setReceiptPath(filePath.toString());

        return transactionRepository.save(tx);
    }

    public Transactions replaceReceipt(Long transactionId, Long userId, MultipartFile file) throws IOException {

        Transactions tx = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        //  Delete old receipt file
        if (tx.getReceiptPath() != null) {
            File oldFile = new File(tx.getReceiptPath());
            if (oldFile.exists()) {
                oldFile.delete();
            }
        }

        //  Create folder if not exists
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        //  Save new receipt with unique name
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path newFilePath = Paths.get(UPLOAD_DIR + filename);

        Files.copy(file.getInputStream(), newFilePath, StandardCopyOption.REPLACE_EXISTING);

        // Update DB path
        tx.setReceiptPath(newFilePath.toString());

        return transactionRepository.save(tx);
    }
    public Resource downloadReceipt(Long transactionId, Long userId) throws IOException {

        Transactions tx = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (tx.getReceiptPath() == null) {
            throw new RuntimeException("No receipt uploaded");
        }

        Path filePath = Paths.get(tx.getReceiptPath());
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            throw new RuntimeException("Receipt file not found on server");
        }

        return resource;
    }

    public Transactions deleteReceipt(Long transactionId, Long userId) {

        Transactions tx = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (tx.getReceiptPath() != null) {

            File oldFile = new File(tx.getReceiptPath());
            if (oldFile.exists()) {
                oldFile.delete();
            }

            tx.setReceiptPath(null); // remove link
            transactionRepository.save(tx);
        }

        return tx;
    }
}
