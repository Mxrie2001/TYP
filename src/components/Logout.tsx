import React, { useEffect } from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
    const { setUser } = useUser(); // Récupérer la fonction pour mettre à jour l'utilisateur
    const navigate = useNavigate(); // Hook pour la navigation

    useEffect(() => {
        const handleLogout = () => {
            try {
                setUser(null); // Définir l'utilisateur sur null pour le déconnecter
                navigate('/login'); // Rediriger vers la page de connexion
            } catch (error) {
                console.error("Erreur lors de la déconnexion:", error);
            }
        };

        handleLogout(); // Appeler la fonction de déconnexion
    }, [navigate, setUser]);

    return (
        <div>
            <h2> Deconexion en cours </h2>
        </div>
    );

};

export default Logout;
