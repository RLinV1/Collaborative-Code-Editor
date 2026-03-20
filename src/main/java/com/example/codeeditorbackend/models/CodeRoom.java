package com.example.codeeditorbackend.models;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "code_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String roomCode;

    @Column(nullable = false)
    private String password;

    @Column(columnDefinition = "TEXT")
    private String code;


    private LocalDateTime createdAt;
}
