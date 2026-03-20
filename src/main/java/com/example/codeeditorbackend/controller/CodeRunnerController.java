package com.example.codeeditorbackend.controller;


import com.example.codeeditorbackend.dto.CodeRunnerRequest;
import org.springframework.web.bind.annotation.*;
import com.example.codeeditorbackend.service.CodeRunnerService;


@RestController
@RequestMapping("/api")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class CodeRunnerController {


    private final CodeRunnerService codeRunnerService;

    public CodeRunnerController(CodeRunnerService codeRunnerService) {
        this.codeRunnerService = codeRunnerService;
    }

    @GetMapping
    private String getRuntimes() {
        return codeRunnerService.getRuntimeCode();
    }

    @PostMapping("/execute")
    private String executeCode(@RequestBody CodeRunnerRequest request) {
        return codeRunnerService.executeCode(request);

    }
}
