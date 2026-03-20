package com.example.codeeditorbackend.config;

import com.example.codeeditorbackend.dto.ChatMessageDTO;
import com.example.codeeditorbackend.dto.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String roomCode = (String) headerAccessor.getSessionAttributes().get("roomCode");

        if (username != null && roomCode != null) {
            log.info("User disconnected: {} from room {}", username, roomCode);

            var chatMessage = ChatMessageDTO.builder()
                    .type(MessageType.LEAVE)
                    .sender(username)
                    .content(username + " has left the room")
                    .roomCode(roomCode)
                    .build();
            messagingTemplate.convertAndSend("/topic/room/" + roomCode , chatMessage);
        }
    }

}
