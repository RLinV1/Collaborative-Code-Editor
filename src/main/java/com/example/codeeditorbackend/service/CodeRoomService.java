package com.example.codeeditorbackend.service;

import com.example.codeeditorbackend.models.CodeRoom;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CodeRoomService {

    private final Map<String, Set<String>> activeRoomUsers = new ConcurrentHashMap<>();

    public void joinRoom(String roomCode, String sessionId) {
        activeRoomUsers.computeIfAbsent(roomCode, k -> ConcurrentHashMap.newKeySet()).add(sessionId);
    }

    public boolean leaveRoom(String roomCode, String sessionId) {

        Set<String> users = activeRoomUsers.get(roomCode);

        if (users == null) {
            return false;
        }

        boolean isRemoved = users.remove(sessionId);
        if (!isRemoved) return false;

        if (users.isEmpty()) {
            activeRoomUsers.remove(roomCode);
        }

        return true;

    }

    public int getRoomCount(String roomCode) {
        Set<String> users = activeRoomUsers.get(roomCode);

        if (users == null) return 0;

        return activeRoomUsers.get(roomCode).size();
    }

    public boolean isUserInRoom(String roomCode, String sessionId) {
        return activeRoomUsers.getOrDefault(roomCode, Set.of()).contains(sessionId);
    }

    public void deleteRooms() {
        activeRoomUsers.clear();
    }
}
