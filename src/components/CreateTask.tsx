import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addTask } from '../TaskService'; // Importer la fonction addTask du service

interface LocationState {
    userID: string;
    petID: string;
}

const CreateTask: React.FC = () => {
    const location = useLocation();
    const { userID, petID } = location.state as LocationState; // Récupérer userID et petID depuis l'état de navigation
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        description: '',
        categorie: '',
    });

    useEffect(() => {
        if (!userID || !petID) {
            alert('Impossible de récupérer l’ID utilisateur ou l’ID de l’animal. Veuillez réessayer.');
            navigate('/'); // Redirige vers la page d'accueil si un ID manque
        }
    }, [userID, petID, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userID || !petID) {
            alert('Impossible de récupérer l’ID utilisateur ou l’ID de l’animal. Veuillez réessayer.');
            return;
        }

        if (!formData.description || !formData.categorie) {
            alert('Tous les champs doivent être remplis.');
            return;
        }

        try {
            // Appel à la fonction addTask pour enregistrer la tâche dans DynamoDB
            await addTask(userID, petID, {
                Description: formData.description, // Clé 'description'
                Categorie: formData.categorie, // Clé 'categorie'
            });

            console.log('Tâche ajoutée avec succès');
            navigate('/todo-list', {state: {userID, petID: petID}}); // Redirige vers la page "Mon Compte"
        } catch (error) {
            console.error('Erreur lors de l’ajout de la tâche :', error);
            alert('Une erreur est survenue lors de l’ajout de la tâche.');
        }
    };

    return (
        <div>
            <h1>Ajouter une tâche</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="description">Description :</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="categorie">Catégorie :</label>
                    <select
                        id="categorie"
                        name="categorie"
                        value={formData.categorie}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Sélectionner une catégorie</option>
                        <option value="Balade">Balade</option>
                        <option value="Éducation">Éducation</option>
                        <option value="Socialisation">Socialisation</option>
                        <option value="Sortie au parc">Sortie au parc</option>
                        <option value="Visite chez le vétérinaire">Visite chez le vétérinaire</option>
                        <option value="Medications">Medications</option>
                    </select>
                </div>
                <button type="submit">Ajouter</button>
                <button type="button" onClick={() => navigate('/todo-list', { state: {userID, petID: petID} })}>
                    Annuler
                </button>
            </form>
        </div>
    );
};

export default CreateTask;
