import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInfoUser } from '../InfoUserContext'; // Hook personnalisé pour accéder au contexte utilisateur
import { usePet } from '../PetContext'; // Hook pour accéder au contexte compagnon
import { getUserInfo } from '../InfoUserService'; // Fonction pour récupérer les infos utilisateur
import { getPetsByUser } from '../PetService'; // Fonction pour récupérer tous les animaux pour un utilisateur

interface LocationState {
    userID: string;
}

const MyAccount: React.FC = () => {
    const { userInfo, setUserInfo } = useInfoUser(); // Accéder et mettre à jour le contexte utilisateur
    const { pets = [], setPets } = usePet(); // Accéder et mettre à jour le contexte compagnon (valeur par défaut si pets est undefined)
    const location = useLocation(); // Utiliser le hook useLocation pour récupérer l'état de la route
    const navigate = useNavigate(); // Hook pour la navigation
    const { userID } = location.state as LocationState; // Récupérer l'ID de l'utilisateur depuis l'état de la route

    const [refresh, setRefresh] = useState(false); // Etat pour forcer le rafraîchissement
    const [error, setError] = useState<string | null>(null); // Etat pour gérer les erreurs

    useEffect(() => {
        // Fonction pour charger les informations utilisateur et compagnon lors du montage du composant
        const fetchUserData = async () => {
            try {
                // Charger les informations utilisateur
                const userData = await getUserInfo(userID);
                if (userData) {
                    setUserInfo(userData);
                } else {
                    console.error('Utilisateur non trouvé');
                    setError('Utilisateur non trouvé');
                }

                // Charger les informations compagnon avec GSI (UserID-index)
                const petData = await getPetsByUser(userID); // Utiliser GSI pour récupérer les animaux par userID
                if (petData) {
                    setPets(petData); // Mettre à jour le contexte avec les données récupérées
                } else {
                    console.error('Aucun compagnon trouvé pour cet utilisateur');
                    setError('Aucun compagnon trouvé pour cet utilisateur');
                }
            } catch (error) {
                console.error('Erreur lors du chargement des informations', error);
                setError('Erreur lors du chargement des informations');
            }
        };

        fetchUserData(); // Charger les données lors du montage du composant
    }, [userID, refresh, setUserInfo, setPets]); // Dépend de refresh pour recharger les données après un ajout

    const handleAddPet = () => {
        // Rediriger vers la page AddPet pour ajouter un compagnon
        navigate('/add-pet', { state: { userID } });
        setRefresh(!refresh);  // Force le rafraîchissement des données
    };

    if (error) {
        return <div>Erreur : {error}</div>;
    }

    if (!userInfo) {
        return <div>Utilisateur non trouvé ou en cours de chargement...</div>;
    }

    if (pets === undefined) {
        return <div>Chargement des compagnons...</div>;
    }

    return (
        <div>
            <h1>Mon Compte</h1>
            {userInfo ? (
                <div>
                    <h3>Informations utilisateur :</h3>
                    <p><strong>ID Utilisateur :</strong> {userInfo.UserID}</p>
                    <p><strong>Prénom :</strong> {userInfo.FirstName}</p>
                    <p><strong>Nom :</strong> {userInfo.LastName}</p>
                    <p><strong>Email :</strong> {userInfo.Email}</p>

                    {/* Ajouter un bouton pour modifier le profil */}
                    <button onClick={() => navigate('/edit-profile', { state: { userID: userInfo.UserID } })}>
                        Modifier le profil
                    </button>

                    <h3>Mon Compagnon :</h3>
                    {pets.length > 0 ? (
                        pets.map((pet) => (
                            <div key={pet.ID}>
                                <p><strong>Nom :</strong> {pet.Name}</p>
                                <p><strong>Type :</strong> {pet.Type}</p>
                                <p><strong>Âge :</strong> {pet.Age} ans</p>

                                {/* Bouton pour modifier les informations du compagnon */}
                                <button onClick={() => navigate('/edit-pet', { state: { userID: pet.UserID, petID: pet.ID } })}>
                                    Modifier les informations du compagnon
                                </button>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p>Vous n'avez pas encore ajouté de compagnon.</p>
                            {/* Bouton pour ajouter un compagnon */}
                            <button onClick={handleAddPet}>
                                Ajouter un compagnon
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    );
};

export default MyAccount;
