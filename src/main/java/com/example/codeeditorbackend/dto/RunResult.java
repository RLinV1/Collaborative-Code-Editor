package com.example.codeeditorbackend.dto;

import lombok.Data;

@Data
public class RunResult {
    private String stdout;
    private String stderr;
    private int code;
    private String signal;
    private String output;
    
}
