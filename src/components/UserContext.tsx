import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    ID: number;
    name: string;
    firstname: string;
    email: string;
    role: string;
    image: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleSetUser = (user: User | null) => {
        setUser(user);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user)); // Stocker dans localStorage
        } else {
            localStorage.removeItem('user'); // Retirer de localStorage
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser: handleSetUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};