import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  // Importer les hooks useLocation et useNavigate
import { getUserInfo } from '../InfoUserService';  // Fonction pour récupérer les données utilisateur
import { updateUserInfo } from '../InfoUserService';  // Fonction pour mettre à jour les données utilisateur

interface LocationState {
    userID: string;
}

const EditProfile: React.FC = () => {
    const { userID } = useLocation().state as LocationState;  // Récupérer l'ID utilisateur depuis l'état de la route
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
    });
    const navigate = useNavigate();  // Hook pour la navigation

    useEffect(() => {
        // Fonction pour charger les informations de l'utilisateur au montage du composant
        const fetchUserData = async () => {
            try {
                const userData = await getUserInfo(userID);  // Récupérer les données utilisateur
                if (userData) {
                    setFormData({
                        FirstName: userData.FirstName,
                        LastName: userData.LastName,
                        Email: userData.Email,
                    });
                } else {
                    console.error('Utilisateur non trouvé');
                }
            } catch (error) {
                console.error('Erreur lors du chargement des informations utilisateur', error);
            }
        };

        fetchUserData();
    }, [userID]);

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await updateUserInfo(userID, formData);  // Appeler le service pour mettre à jour les informations
            alert('Informations mises à jour avec succès');
            navigate('/my-account', { state: { userID } });  // Rediriger vers la page Mon Compte après la mise à jour
        } catch (error) {
            console.error('Erreur lors de la mise à jour des informations utilisateur', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div>
            <h1>Modifier mon profil</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Prénom</label>
                    <input
                        type="text"
                        name="FirstName"
                        value={formData.FirstName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Nom</label>
                    <input
                        type="text"
                        name="LastName"
                        value={formData.LastName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Enregistrer les modifications</button>
            </form>
        </div>
    );
};

export default EditProfile;
