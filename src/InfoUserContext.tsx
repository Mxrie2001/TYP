import React, { createContext, useContext, useState } from 'react';

// Interface représentant les informations utilisateur
interface InfoUser {
    UserID: string;
    FirstName: string;
    LastName: string;
    Email: string;
}

// Interface pour le contexte utilisateur
interface InfoUserContextType {
    userInfo: InfoUser | null;
    setUserInfo: (userInfo: InfoUser | null) => void;
}

// Création du contexte
const InfoUserContext = createContext<InfoUserContextType | undefined>(undefined);

// Fournisseur du contexte
export const InfoUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userInfo, setUserInfo] = useState<InfoUser | null>(null);

    return (
        <InfoUserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </InfoUserContext.Provider>
    );
};

// Hook pour accéder au contexte
export const useInfoUser = (): InfoUserContextType => {
    const context = useContext(InfoUserContext);
    if (!context) {
        throw new Error('useInfoUser must be used within an InfoUserProvider');
    }
    return context;
};
