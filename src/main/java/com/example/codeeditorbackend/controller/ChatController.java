package com.example.codeeditorbackend.controller;

import com.example.codeeditorbackend.dto.ChatMessageDTO;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{roomCode}/sendMessage")
    public void sendMessage(@DestinationVariable String roomCode, @Payload ChatMessageDTO chatMessage) {
        messagingTemplate.convertAndSend("/topic/room/" + roomCode, chatMessage);
    }

    @MessageMapping("/chat/{roomCode}/addUser")
    public void addUser(@DestinationVariable String roomCode, @Payload ChatMessageDTO chatMessage,
                        SimpMessageHeaderAccessor headerAccessor) {

        // Store username and roomCode in the WebSocket session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        headerAccessor.getSessionAttributes().put("roomCode", roomCode);

        messagingTemplate.convertAndSend(
                "/topic/room/" + roomCode,
                chatMessage
        );

    }
}
