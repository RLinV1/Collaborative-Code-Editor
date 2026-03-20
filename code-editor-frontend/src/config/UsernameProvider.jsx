import { createContext, useContext, useState } from 'react';

const UsernameContext = createContext(null);

export const UsernameProvider = ({ children }) => {
    const [username] = useState(() => {
        const saved = localStorage.getItem("username");
        if (saved) return saved;
        const newName = `User${Math.floor(Math.random() * 10000)}`;
        localStorage.setItem("username", newName);
        return newName;
    });

    return (
        <UsernameContext.Provider value={username}>
            {children}
        </UsernameContext.Provider>
    );
};

export const useUsername = () => useContext(UsernameContext);
