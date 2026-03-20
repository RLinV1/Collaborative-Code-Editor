package com.example.codeeditorbackend.dto;

import lombok.Data;

@Data
public class PistonResponse {
    private RunResult run;
    private String language;
    private String version;

}

