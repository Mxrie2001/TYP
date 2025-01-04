import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addTask } from '../TaskService'; // Importer la fonction addTask du service
import './Page.css';

interface LocationState {
    userID: string;
    petID: string;
}

const CreateTask: React.FC = () => {
    const location = useLocation();
    const { userID, petID } = location.state as LocationState; // Récupérer userID et petID depuis l’état de navigation
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
            navigate('/todo-list', { state: { userID, petID } }); // Redirige vers la page "To-Do List"
        } catch (error) {
            console.error('Erreur lors de l’ajout de la tâche :', error);
            alert('Une erreur est survenue lors de l’ajout de la tâche.');
        }
    };

    const taskCategories = [
        'Walk',
        'Training',
        'Socialization',
        'Park outing',
        'Veterinary visit',
        'Medications',
        'Group training',
        'Playdate',
        'Community event',
        'Group walk',
        'Pet meetup',
    ];


    return (
        <div className="PageContent">
            <h1 className="Title">Add a Task</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <img src="addTodo.jpg" alt="new Task" className="pp" />
                    <div className="InputRegister">
                        <div>
                            <label htmlFor="description"><strong>Description :</strong></label>
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
                            <label htmlFor="categorie"><strong>Category :</strong></label>
                            <select
                                id="categorie"
                                name="categorie"
                                value={formData.categorie}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a category</option>
                                {taskCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="BtnEdit">
                    <button type="submit">Add</button>
                    <button
                        className="cancelBtn"
                        type="button"
                        onClick={() => navigate('/todo-list', { state: { userID, petID } })}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTask;
