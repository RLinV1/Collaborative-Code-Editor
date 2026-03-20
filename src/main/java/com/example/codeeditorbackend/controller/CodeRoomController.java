package com.example.codeeditorbackend.controller;

import com.example.codeeditorbackend.dto.CodeRoomRequest;
import com.example.codeeditorbackend.dto.JoinRoomRequest;
import com.example.codeeditorbackend.dto.LeaveRoomRequest;
import com.example.codeeditorbackend.models.CodeRoom;
import com.example.codeeditorbackend.repo.CodeRoomRepository;
import com.example.codeeditorbackend.service.CodeRoomService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/coderoom")
@AllArgsConstructor
public class CodeRoomController {

    private final CodeRoomRepository codeRoomRepository;
    private final PasswordEncoder passwordEncoder;
    private final CodeRoomService codeRoomService;


    @PostMapping("/create")
    public ResponseEntity<CodeRoom> createCodeRoom(@RequestBody CodeRoomRequest request){
        CodeRoom codeRoom = CodeRoom.builder()
                .roomCode(UUID.randomUUID().toString())
                .password(passwordEncoder.encode(request.getPassword()))
                .createdAt(LocalDateTime.now())
                .build();

        codeRoomRepository.save(codeRoom);
        return ResponseEntity.status(HttpStatus.CREATED).body(codeRoom);
    }
    
    
    @PostMapping("/join")
    public ResponseEntity<CodeRoom> joinCodeRoom(@RequestBody JoinRoomRequest request, HttpSession session){
        CodeRoom codeRoom = codeRoomRepository.findByRoomCode(request.getRoomCode())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        System.out.println(session.getId());
        if (codeRoom != null && passwordEncoder.matches(request.getPassword(), codeRoom.getPassword())) {
            codeRoomService.joinRoom(request.getRoomCode(), session.getId());
            return ResponseEntity.ok(codeRoom);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{roomCode}/checkUser")
    public ResponseEntity<CodeRoom> isUserInRoom(@PathVariable String roomCode, HttpSession session){
        CodeRoom codeRoom = codeRoomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        System.out.println(session.getId());
        boolean isInRoom = codeRoomService.isUserInRoom(roomCode, session.getId());

        if (isInRoom) return ResponseEntity.ok(codeRoom);
        else return ResponseEntity.notFound().build();

    }

    @PostMapping("/leave")
    public ResponseEntity<String> leaveCodeRoom(@RequestBody LeaveRoomRequest request, HttpSession session){
        CodeRoom codeRoom = codeRoomRepository.findByRoomCode(request.getRoomCode())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        ;
        System.out.println(session.getId());
        if (codeRoom == null) return ResponseEntity.notFound().build();


        boolean isValid = codeRoomService.leaveRoom(request.getRoomCode(), session.getId());
        if (!isValid) return ResponseEntity.notFound().build();

        if (codeRoomService.getRoomCount(request.getRoomCode()) == 0) {
            codeRoomRepository.delete(codeRoom);
        }


        return ResponseEntity.ok("Left room");
    }

}
