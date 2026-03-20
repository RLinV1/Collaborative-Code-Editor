package com.example.codeeditorbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CodeEditorBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodeEditorBackendApplication.class, args);
    }

}
