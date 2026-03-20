import {useEffect, useRef, useState} from 'react'
import Editor from '@monaco-editor/react'
import Split from 'react-split'
import {useWebSocket} from "./config/WebSocketContext.jsx";
import axios from "axios";
import {Resizable} from 'react-resizable';
import 'react-resizable/css/styles.css';
import {useNavigate} from "react-router-dom";


function CodeRoom() {
    const [chatSize, setChatSize] = useState({width: 500, height: 420});
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [inputMessage, setInputMessage] = useState('')
    const [codeOutput, setOutput] = useState("Ready to Run...")
    const [isCopied, setIsCopied] = useState(false)
    const navigate = useNavigate();
    const {connected, messages, sendMessage, username, leaveRoom, code, setCode, roomCode, language, handleCodeChange, handleLanguageChange} = useWebSocket()
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        const fetchRoom = async () => {

            try {
                const res = await axios.get(
                    `http://localhost:8080/api/coderoom/${roomCode}/checkUser`,
                    { withCredentials: true }
                );


                console.log(res.data);
                if (res.data.code === null) {
                    setCode("// Write your code here")
                } else {
                    setCode(res.data.code);
                }

            } catch (err) {
                console.error("Failed to fetch room:", err);
                navigate("/")
            }
        };

        if (roomCode) {
            fetchRoom().then(r => console.log(r));
        }
    }, [roomCode]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    const handleCodeRun = () => {
        console.log('Run code')
        axios.post('http://localhost:8080/api/execute', {
            language: language,
            files: [{"name": "code_test", "content": code}]
        }).then(r => {
            console.log(r)
            setOutput(r.data)
        })
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage()
        }
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(roomCode);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        if (!connected) {
            console.error('Not connected to server');
            return;
        }

        const message = {
            sender: username,
            content: inputMessage,
            type: "CHAT",
        };

        sendMessage(message);
        setInputMessage('');
    }

    const clearCode = () => {
        setCode("// Write your code here")
    }






    return (
        <div className="h-screen bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Code Editor</h1>
                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="bg-gray-700 px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                </select>
                <div className="flex gap-3 items-center">
                    <div onClick={handleCopy} className={ isCopied ? "text-green-500 bg-blue-500 rounded-lg p-2" : "text-white cursor-pointer bg-blue-500 rounded-lg p-2"}>
                        {isCopied ? "Copied!" : "Copy Room Code"}
                    </div>
                    <button onClick={leaveRoom}
                            className="bg-red-500 text-white text-bold p-2 rounded-lg cursor-pointer">Leave Room
                    </button>
                </div>

            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <Split
                    sizes={[60, 40]}
                    direction="vertical"
                    gutterSize={8}
                    minSize={100}
                    className="split-vertical h-full flex flex-col"
                >
                    {/* Editor Section */}
                    <div className="overflow-hidden">
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={handleCodeChange}
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                minimap: {enabled: false},
                                scrollBeyondLastLine: false,
                            }}
                        />
                    </div>

                    {/* Bottom Section */}
                    <div className="flex flex-col bg-gray-900 overflow-hidden">
                        {/* Control Bar */}
                        <div className="bg-gray-800 px-6 py-3 flex gap-3 border-b border-gray-700">
                            <button
                                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-medium transition cursor-pointer"
                                onClick={handleCodeRun}>
                                Run Code
                            </button>
                            <button
                                className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded font-medium transition cursor-pointer"
                                onClick={clearCode}>
                                Clear
                            </button>
                        </div>

                        {/* Output Section */}
                        <div className="flex-1 p-6 overflow-auto">
                            <h2 className="text-lg font-semibold mb-3 text-gray-300">Output:</h2>
                            <pre className="bg-black p-4 rounded text-green-400 font-mono text-sm">
                                {codeOutput}
                            </pre>
                        </div>
                    </div>
                </Split>
            </div>

            {/*chat message*/}
            <div className="fixed bottom-4 right-4 z-50">
                {isChatOpen ? (
                    <Resizable
                        width={chatSize.width}
                        height={chatSize.height}
                        onResize={(e, {size}) => {
                            setChatSize({width: size.width, height: size.height});
                        }}
                        minConstraints={[300, 300]}
                        maxConstraints={[800, 800]}
                        resizeHandles={['w', 'nw', 'n']}
                    >
                        <div
                            className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl flex flex-col"
                            style={{width: `${chatSize.width}px`, height: `${chatSize.height}px`}}
                        >
                            <div
                                className="bg-gray-700 px-4 py-3 flex items-center justify-between rounded-t-lg border-b border-gray-600">
                                <h3 className="font-semibold">Chat Room</h3>
                                <button
                                    onClick={() => setIsChatOpen(false)}
                                    className="text-gray-400 hover:text-white transition cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div ref={messagesContainerRef}
                                 className="flex-1 overflow-y-auto p-4 space-y-2">
                                {messages.length === 0 ? (
                                    <p className="text-gray-500 text-sm text-center mt-8">
                                        No messages yet. Start chatting!
                                    </p>
                                ) : (
                                    messages.map((msg, idx) => {
                                        if (msg.sender === username) {
                                            return (
                                                <div key={idx} className="bg-blue-900 rounded p-2">
                                                    <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-blue-400 text-sm">
                                                        {msg.sender}
                                                    </span>
                                                    </div>
                                                    <p className="text-sm mt-1">{msg.content}</p>
                                                </div>
                                            )
                                        }

                                        return (
                                            <div key={idx} className="bg-gray-500 rounded p-2">
                                                <div className="flex gap-2 justify-end">
                                                    <span className="font-semibold text-blue-400 text-sm">
                                                        {msg.sender}
                                                    </span>
                                                </div>
                                                <p className="text-sm mt-1 text-end">{msg.content}</p>
                                            </div>
                                        )
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-3 border-t border-gray-700">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-gray-700 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium transition cursor-pointer"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Resizable>
                ) : (
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full shadow-lg font-medium transition cursor-pointer"
                    >
                        💬 Chat
                    </button>
                )}
            </div>
        </div>
    )
}

export default CodeRoom