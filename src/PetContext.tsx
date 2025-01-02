import React, { createContext, useContext, useState } from 'react';

// Interface représentant les informations d'un animal
export interface PetInfo {
    ID: string;
    UserID: string;
    Name: string;
    Type: string;
    Age: number;
}

// Interface pour le contexte
interface PetContextType {
    pets: PetInfo[]; // Liste des animaux
    setPets: (pets: PetInfo[]) => void; // Fonction pour mettre à jour la liste des animaux
}

// Création du contexte
const PetContext = createContext<PetContextType | undefined>(undefined);

// Fournisseur du contexte
export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pets, setPets] = useState<PetInfo[]>([]); // État local pour les animaux

    return (
        <PetContext.Provider value={{ pets, setPets }}>
            {children}
        </PetContext.Provider>
    );
};

// Hook personnalisé pour accéder au contexte
export const usePet = (): PetContextType => {
    const context = useContext(PetContext);
    if (!context) {
        throw new Error('usePet must be used within a PetProvider');
    }
    return context;
};
