package com.ssafy.triplet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class TripletApplication {

	public static void main(String[] args) {
		SpringApplication.run(TripletApplication.class, args);
	}

}
