package com.example.codeeditorbackend.dto;

import lombok.Data;

import java.util.List;

@Data
public class CodeRunnerResponse {
    private List<String> output;
}
