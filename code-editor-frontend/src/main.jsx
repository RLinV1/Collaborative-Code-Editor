import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import RoomWrapper from "./RoomWrapper.jsx";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/room/:roomCode" element={<RoomWrapper />} />
        </Routes>
    </BrowserRouter>


)
