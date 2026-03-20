import {useParams} from "react-router-dom";
import CodeRoom from "./CodeRoom.jsx";
import {WebSocketProvider} from "./config/WebSocketContext.jsx";
import {UsernameProvider} from "./config/UsernameProvider.jsx";

function RoomWrapper() {
    const {roomCode} = useParams();

    return (
        <UsernameProvider>
            <WebSocketProvider roomCode={roomCode}>
                <CodeRoom/>
            </WebSocketProvider>
        </UsernameProvider>
    );
}

export default RoomWrapper;

