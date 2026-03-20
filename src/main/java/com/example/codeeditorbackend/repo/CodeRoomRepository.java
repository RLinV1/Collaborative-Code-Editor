package com.example.codeeditorbackend.repo;

import com.example.codeeditorbackend.models.CodeRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface CodeRoomRepository extends JpaRepository<CodeRoom, Long> {
    Optional<CodeRoom> findByRoomCode(String roomCode);
    void deleteCodeRoomsByCreatedAtBefore(LocalDateTime dateTime);
}
