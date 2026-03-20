package com.example.codeeditorbackend.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class CodeRunnerRequest {
    private String language;
    private String version;
    private List<Map<String, String>> files;
}
