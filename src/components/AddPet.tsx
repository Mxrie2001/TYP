import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addPet } from '../PetService'; // Importer la fonction addPet du service

interface LocationState {
    userID: string;
}

const AddPet: React.FC = () => {
    const location = useLocation();
    const userID = (location.state as LocationState)?.userID; // Récupérer l'ID utilisateur depuis l'état de navigation
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        age: '',
    });

    useEffect(() => {
        if (!userID) {
            alert('Impossible de récupérer l’ID utilisateur. Veuillez réessayer.');
            navigate('/'); // Redirige vers la page d'accueil si l'ID est manquant
        }
    }, [userID, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userID) {
            alert('Impossible de récupérer l’ID utilisateur. Veuillez réessayer.');
            return;
        }

        if (!formData.name || !formData.type || !formData.age) {
            alert('Tous les champs doivent être remplis.');
            return;
        }

        try {
            // Appel à la fonction addPet pour enregistrer les informations dans DynamoDB
            await addPet(userID, {
                Name: formData.name,
                Type: formData.type,
                Age: parseInt(formData.age, 10),
            });

            console.log('Compagnon ajouté avec succès');
            navigate('/my-account', { state: { userID } }); // Redirige vers la page "Mon Compte"
        } catch (error) {
            console.error('Erreur lors de l’ajout de votre compagnon :', error);
            alert('Une erreur est survenue lors de l’ajout de votre compagnon.');
        }
    };

    return (
        <div>
            <h1>Ajouter un compagnon</h1>
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
                <button type="submit">Ajouter</button>
                <button type="button" onClick={() => navigate('/my-account', { state: { userID } })}>
                    Annuler
                </button>
            </form>
        </div>
    );
};

export default AddPet;
