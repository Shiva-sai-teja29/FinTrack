package com.financeTracking.Fintrack.TransactionService.Service;

import com.financeTracking.Fintrack.TransactionService.Model.TransactionDto;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.List;

@Service
public class DownloadService {

    public ByteArrayInputStream generateCsv(List<TransactionDto> data) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);
        // Header
        writer.println("S.no,Category,Amount,Date,Type,Description,PaymentType");
        // Data
        int serial = 1;
        for (TransactionDto t : data) {
            writer.println(serial + "," + t.getCategory() + "," + t.getAmount() + "," +t.getDate() + "," +t.getType() + "," +t.getDescription()+","+t.getPaymentType());
            serial++;
        }
        writer.flush();
        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream generateExcel(List<TransactionDto> data) throws Exception{

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Transactions");

        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("S.no");
        headerRow.createCell(1).setCellValue("Category");
        headerRow.createCell(2).setCellValue("Amount");
        headerRow.createCell(3).setCellValue("Date");
        headerRow.createCell(4).setCellValue("Type");
        headerRow.createCell(5).setCellValue("Description");
        headerRow.createCell(6).setCellValue("PaymentType");

        int rowIdx = 1;
        for (TransactionDto t : data) {
            Row row = sheet.createRow(rowIdx);
            row.createCell(0).setCellValue(rowIdx);
            row.createCell(1).setCellValue(t.getCategory());
            row.createCell(2).setCellValue(t.getAmount());
            row.createCell(3).setCellValue(t.getDate());
            row.createCell(4).setCellValue(String.valueOf(t.getType()));
            row.createCell(5).setCellValue(t.getDescription());
            row.createCell(6).setCellValue(String.valueOf(t.getPaymentType()));
            rowIdx++;
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return new ByteArrayInputStream(out.toByteArray());

    }
}
