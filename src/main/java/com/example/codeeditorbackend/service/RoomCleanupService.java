package com.example.codeeditorbackend.service;

import com.example.codeeditorbackend.repo.CodeRoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RoomCleanupService {
    private final CodeRoomService codeRoomService;
    private final CodeRoomRepository codeRoomRepository;

    //cleans up every 24 hr
    @Scheduled(fixedRate = 86400000)
    @Transactional
    public void cleanupRooms() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        codeRoomRepository.deleteCodeRoomsByCreatedAtBefore(cutoff);
        codeRoomService.deleteRooms();

        System.out.println("Cleanup rooms");
    }
}
