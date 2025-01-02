import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInfoUser } from '../InfoUserContext';
import { usePet } from '../PetContext';
import { getUserInfo } from '../InfoUserService';
import { getPetsByUser } from '../PetService';

interface LocationState {
    userID: string;
}

const MyAccount: React.FC = () => {
    const { userInfo, setUserInfo } = useInfoUser();
    const { pets = [], setPets } = usePet();
    const location = useLocation();
    const navigate = useNavigate();
    const { userID } = location.state as LocationState;

    const [refresh, setRefresh] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserInfo(userID);
                if (userData) {
                    setUserInfo(userData);
                } else {
                    setError('Utilisateur non trouvé');
                }

                const petData = await getPetsByUser(userID);
                if (petData) {
                    setPets(petData);
                } else {
                    setError('Aucun compagnon trouvé pour cet utilisateur');
                }
            } catch (error) {
                console.error('Erreur lors du chargement des informations', error);
                setError('Erreur lors du chargement des informations');
            }
        };

        fetchUserData();
    }, [userID, refresh, setUserInfo, setPets]);

    const handleAddPet = () => {
        navigate('/add-pet', { state: { userID } });
        setRefresh(!refresh);
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

                    <button onClick={() => navigate('/edit-profile', { state: { userID: userInfo.UserID } })}>
                        Modifier le profil
                    </button>

                    <h3>Mon(Mes) Compagnon(s) :</h3>
                    {pets.length > 0 ? (
                        pets.map((pet) => (
                            <div key={pet.ID}>
                                <p><strong>Nom :</strong> {pet.Name}</p>
                                <p><strong>Type :</strong> {pet.Type}</p>
                                <p><strong>Âge :</strong> {pet.Age} ans</p>

                                <button
                                    onClick={() => {
                                        if (userID && pet.ID) {
                                            navigate('/edit-pet', {state: {userID, petID: pet.ID}});
                                        } else {
                                            alert("Impossible de récupérer l’ID du compagnon ou de l’utilisateur. Veuillez réessayer.");
                                        }
                                    }}
                                >
                                    Modifier les informations du compagnon
                                </button>

                                <button
                                    onClick={() => {
                                        if (userID && pet.ID) {
                                            navigate('/todo-list', {state: {userID, petID: pet.ID}});
                                        } else {
                                            alert("Impossible de récupérer l’ID du compagnon ou de l’utilisateur. Veuillez réessayer.");
                                        }
                                    }}
                                >
                                    To-Do List
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Vous n'avez pas encore ajouté de compagnon.</p>
                    )}

                    {/* Toujours afficher le bouton pour ajouter un compagnon */}
                    <button onClick={handleAddPet}>
                        Ajouter un compagnon
                    </button>
                </div>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    );
};

export default MyAccount;
