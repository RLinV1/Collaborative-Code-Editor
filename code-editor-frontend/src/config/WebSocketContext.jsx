import { createContext, useContext, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const WebSocketContext = createContext(null);

const getUsername = () => {
    let username = localStorage.getItem('coderoom_username');
    if (!username) {
        username = `User${Math.floor(Math.random() * 10000)}`;
        localStorage.setItem('coderoom_username', username);
    }
    return username;
};

export const WebSocketProvider = ({ children, roomCode}) => {
    const stompClient = useRef(null);
    const [connected, setConnected] = useState(false);
    const [code, setCode] = useState('// Write your code here')
    const [messages, setMessages] = useState([]);
    const [username] = useState(getUsername());
    const [language, setLanguage] = useState('javascript')
    const navigate = useNavigate();

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws', null, { withCredentials: true }),
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                setConnected(true);
                console.log('Connected to the server');

                client.subscribe(`/topic/room/${roomCode}`, (response) => {
                    const message = JSON.parse(response.body);

                    setMessages((prevMessages) => [...prevMessages, message]);
                    if (message.type === "JOIN" && message.sender !== username) {
                        const stateMessage = {
                            sender: username,
                            code: code,
                            language: language,
                            type: "CODE_UPDATE"
                        };
                        client.publish({
                            destination: `/app/code/${roomCode}/update`,
                            body: JSON.stringify(stateMessage)
                        });
                    }
                });

                client.subscribe(`/topic/room/${roomCode}/code`, (response) => {
                    const codeUpdate = JSON.parse(response.body);
                    // Update from all users to keep tabs in sync
                    setCode(codeUpdate.code);
                    if (codeUpdate.language) {
                        setLanguage(codeUpdate.language);
                    }
                })

            },
            onDisconnect: () => {
                setConnected(false);
                console.log("Disconnected from the server");
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
            }
        });

        client.activate();
        stompClient.current = client;

        return () => {
            if (stompClient.current) {
                client.deactivate();
            }
        };
    }, [username, roomCode]);

    const sendMessage = (message) => {
        if (stompClient.current && connected) {
            stompClient.current.publish({
                destination: `/app/chat/${roomCode}/sendMessage`,
                body: JSON.stringify(message)
            });
        }
    };

    const leaveRoom = () => {
        const leaveMessage = {
            sender: username,
            content: `${username} left the room`,
            type: "LEAVE",
        };
        sendMessage(leaveMessage);

        // Clear the join flag so they can rejoin later
        const joinKey = `joined_${roomCode}_${username}`;
        sessionStorage.removeItem(joinKey);

        axios.post("http://localhost:8080/api/coderoom/leave", {
            roomCode: roomCode
        }, { withCredentials: true }).then(r => console.log(r.data))

        navigate("/")
        stompClient.current.deactivate();
        setConnected(false);
    }

    const handleCodeChange = (newCode) => {
        setCode(newCode);

        const codeUpdateMessage = {
            sender: username,
            code: newCode,
            language: language,
            type: "CODE_UPDATE"
        }
        stompClient.current.publish({
            destination: `/app/code/${roomCode}/update`,
            body: JSON.stringify(codeUpdateMessage)
        });
    }

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;

        let updatedCode = newLanguage === "python" ? "# Write your code here" : "// Write your code here";

        setCode(updatedCode);
        setLanguage(newLanguage);

        const codeUpdateMessage = {
            sender: username,
            code: updatedCode,
            language: newLanguage,
            type: "CODE_UPDATE"
        }
        stompClient.current.publish({
            destination: `/app/code/${roomCode}/update`,
            body: JSON.stringify(codeUpdateMessage)
        });
    }

    return (
        <WebSocketContext.Provider value={{
            connected,
            messages,
            sendMessage,
            username,
            leaveRoom,
            code,
            setCode,
            roomCode,
            language,
            setLanguage,
            handleCodeChange,
            handleLanguageChange
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

// Custom hook to use the WebSocket context
export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within WebSocketProvider');
    }
    return context;
};