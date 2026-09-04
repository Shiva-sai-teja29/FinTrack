package com.financeTracking.Fintrack.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.LocalDateTime;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    public EmailService(JavaMailSender mailSender,
                        SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Value("${spring.mail.username}")
    private String fromMailId;

    public boolean sendResetLink(String mail, String token) throws MessagingException {

        Context context = new Context();
        context.setVariable("appName", "Finance Tracking App");
        context.setVariable("name", token);
        context.setVariable("message", "Refer the above OTP to reset password, it valid up to 10min.");
        context.setVariable("buttonLink", "https://daily-finance-tracking.netlify.app/");
        context.setVariable("buttonText", "Click here");
        context.setVariable("expires", LocalDateTime.now().plusMinutes(10));

        String htmlContent = templateEngine.process("email-content", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(mail);
        helper.setFrom(fromMailId);
        helper.setSubject("Finance Tracking App Password reset");
        helper.setText(htmlContent, true);

        try {
            mailSender.send(message);
            logger.info("Mail sent to: {}",mail );
            return true;
        }catch (Exception e) {
            logger.error("Failed to send email: {}", e.getMessage());
            return false;
        }
    }
}
