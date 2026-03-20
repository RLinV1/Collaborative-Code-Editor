package com.example.codeeditorbackend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CodeRoomRequest {
    private String password;
}
