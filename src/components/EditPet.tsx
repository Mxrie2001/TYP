import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPetInfo, updatePetInfo } from '../PetService'; // Importer les fonctions nécessaires
import "./Page.css";

interface LocationState {
    petID: string;
    userID: string;
}

const EditPet: React.FC = () => {
    const location = useLocation();
    const petID = (location.state as LocationState)?.petID; // Récupérer l'ID du compagnon depuis l'état de navigation
    const userID = (location.state as LocationState)?.userID; // Récupérer l'ID de l'utilisateur
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        age: '',
    });

    useEffect(() => {
        if (!petID || !userID) {
            alert('Impossible de récupérer l’ID du compagnon ou de l’utilisateur. Veuillez réessayer.');
            navigate('/'); // Redirige vers la page d'accueil si l'ID est manquant
            return;
        }

        const fetchPetData = async () => {
            try {
                const petData = await getPetInfo(petID); // Récupérer les données du compagnon
                if (petData) {
                    setFormData({
                        name: petData.Name,
                        type: petData.Type,
                        age: petData.Age.toString(),
                    });
                } else {
                    console.error('Compagnon non trouvé');
                }
            } catch (error) {
                console.error('Erreur lors du chargement des informations du compagnon', error);
            }
        };

        fetchPetData();
    }, [petID, userID, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name || !formData.type || !formData.age) {
            alert('Tous les champs doivent être remplis.');
            return;
        }

        try {
            console.log('Pet ID:', petID);
            console.log('Form Data:', formData);

            // Appel à la fonction updatePetInfo pour mettre à jour les informations dans DynamoDB
            await updatePetInfo(petID, {
                Name: formData.name,
                Type: formData.type,
                Age: parseInt(formData.age, 10),
            });

            console.log('Compagnon mis à jour avec succès');
            navigate('/my-account', { state: { userID } }); // Redirige vers la page "Mon Compte"
        } catch (error) {
            console.error('Erreur lors de la mise à jour du compagnon :', error);
            alert('Une erreur est survenue lors de la mise à jour du compagnon.');
        }
    };

    return (
        <div>
            <h1>Modifier votre compagnon</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nom :</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="type">Type :</label>
                    <input
                        type="text"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="age">Âge :</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Mettre à jour</button>
                <button type="button" onClick={() => navigate('/my-account', { state: { userID: userID } })}>
                    Annuler
                </button>
            </form>
        </div>
    );
};

export default EditPet;
