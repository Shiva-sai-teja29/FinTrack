package com.financeTracking.Fintrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class FintrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(FintrackApplication.class, args);
	}

}
