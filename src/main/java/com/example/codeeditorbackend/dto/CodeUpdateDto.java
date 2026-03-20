package com.example.codeeditorbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeUpdateDto {
    private String sender;
    private String code;
    private String language;
    private CodeUpdateType type;
}
