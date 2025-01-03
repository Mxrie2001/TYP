// UserContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
    userID: string | null;
    setUserID: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Le type `ReactNode` est utilisé pour accepter des enfants dans le composant
interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [userID, setUserID] = useState<string | null>(null);

    return (
        <UserContext.Provider value={{ userID, setUserID }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
