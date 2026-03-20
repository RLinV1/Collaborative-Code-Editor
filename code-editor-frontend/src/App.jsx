import {useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

function App() {
    const navigate = useNavigate();
    const [createRoom, setCreateRoom] = useState(true);
    const [roomCode, setRoomCode] = useState("");
    const [password, setPassword] = useState("");

    const handleCreateRoom = async (e) => {
        e.preventDefault(); // 🚫 stop page refresh


        const res = await axios.post('http://localhost:8080/api/coderoom/create', {
            password: password
        }, { withCredentials: true })

        const currentRoomCode = res.data.roomCode;

        try {
            const res = await axios.post('http://localhost:8080/api/coderoom/join', {
                roomCode: currentRoomCode,
                password: password
            },   { withCredentials: true })
            console.log(res)
        } catch (err) {
            alert("Invalid room code or password")
        }

        if (res.status !== 201) return;

        navigate(`/room/${res.data.roomCode}`);
    };

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        console.log(roomCode)
        try {
            const res = await axios.post('http://localhost:8080/api/coderoom/join', {
                roomCode: roomCode,
                password: password
            }, { withCredentials: true })

        } catch (err) {
            alert("Invalid room code or password")
        }

        navigate(`/room/${roomCode}`);
    }

    return (
        <div className="flex flex-col bg-blue-950 w-full h-screen justify-center items-center text-white">

            <h1 className="text-3xl font-semibold mb-6">
                Welcome To CodeRooms
            </h1>

            <form
                className="flex flex-col gap-3 w-1/3 bg-white p-6 rounded-xl"
                onSubmit={createRoom ? handleCreateRoom : handleJoinRoom}
            >
                {!createRoom &&

                    <input
                        className="text-black px-3 py-2 rounded border-3 border-gray-300 focus:outline-none focus:border-blue-500"
                        type="text"
                        placeholder="Enter a room code"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                    />
                }
                <input
                    className="text-black px-3 py-2 rounded border-3 border-gray-300 focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder="Enter a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 rounded py-2 cursor-pointer"
                >
                    {createRoom ? "Create Room" : "Join Room"}
                </button>
                <div className="text-black text-center">
                    {!createRoom ? "Want to create a room " : "Want to join an existing room? "}
                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => setCreateRoom(!createRoom)}>Click here</span>
                </div>
            </form>

        </div>
    );
}

export default App;
