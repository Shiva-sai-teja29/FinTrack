package com.financeTracking.Fintrack.TransactionService.controller;

import com.financeTracking.Fintrack.AuthService.entities.User;
import com.financeTracking.Fintrack.TransactionService.Model.Transactions;
import com.financeTracking.Fintrack.TransactionService.Service.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/transactions")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    @PostMapping("/{id}/upload-receipt")
    public ResponseEntity<?> uploadReceipt(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        User user = extractUser();
        try {
            Transactions tx = receiptService.uploadReceipt(id, user.getId(), file);
            return ResponseEntity.ok(tx);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/{id}/replace-receipt")
    public ResponseEntity<?> replaceReceipt(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        User user = extractUser();
        try {
            Transactions tx = receiptService.replaceReceipt(id, user.getId(), file);
            return ResponseEntity.ok(tx);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{id}/receipt")
    public ResponseEntity<?> downloadReceipt(
            @PathVariable Long id) {
        User user = extractUser();
        try {
            Resource file = receiptService.downloadReceipt(id, user.getId());
            String contentType = "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + file.getFilename() + "\"")
                    .body(file);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/receipt")
    public ResponseEntity<?> deleteReceipt(
            @PathVariable Long id) {
        User user = extractUser();
        try {
            Transactions tx = receiptService.deleteReceipt(id, user.getId());
            return ResponseEntity.ok("Receipt deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{id}/receipt/preview")
    public ResponseEntity<?> previewReceipt(
            @PathVariable Long id) {
        User user = extractUser();
        try {
            Resource file = receiptService.downloadReceipt(id, user.getId());

            String contentType = Files.probeContentType(Paths.get(file.getFile().getAbsolutePath()));

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(file);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    public User extractUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return user;
    }

}
