package com.scoresaga;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class scoreSagaApplication {

	public static void main(String[] args) {
		SpringApplication.run(scoreSagaApplication.class, args);
	}

}
