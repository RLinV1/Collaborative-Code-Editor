package com.example.codeeditorbackend.controller;

import com.example.codeeditorbackend.dto.CodeUpdateDto;
import com.example.codeeditorbackend.models.CodeRoom;
import com.example.codeeditorbackend.repo.CodeRoomRepository;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class CodeEditorController {

    private final SimpMessagingTemplate messagingTemplate;
    private final CodeRoomRepository codeRoomRepository;

    @MessageMapping("/code/{roomCode}/update")
    public void updateCode(@DestinationVariable String roomCode, @Payload CodeUpdateDto code){
        CodeRoom codeRoom = codeRoomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        codeRoom.setCode(code.getCode());
        codeRoomRepository.save(codeRoom);
        messagingTemplate.convertAndSend("/topic/room/" + roomCode + "/code", code);
    }
}
