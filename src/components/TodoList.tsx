import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTasksByPet, toggleTaskCompletion, deleteTask } from '../TaskService';
import { useTask } from '../TaskContext';

interface LocationState {
    petID: string;
    userID: string;
}

const TodoList: React.FC = () => {
    const { tasks, setTasks } = useTask();
    const location = useLocation();
    const navigate = useNavigate();
    const { userID, petID } = location.state as LocationState;

    const [error, setError] = useState<string | null>(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const fetchedTasks = await getTasksByPet(petID);
                console.log('Tâches récupérées:', fetchedTasks);  // Affiche les tâches dans la console
                setTasks(fetchedTasks);
            } catch {
                setError('Erreur lors du chargement des tâches');
            }
        };

        fetchTasks();
    }, [petID, refresh, setTasks]);

    const handleCreateTask = () => {
        navigate('/create-task', { state: { userID, petID } });
    };

    const handleToggleTaskCompletion = async (taskID: number, completed: boolean) => {
        try {
            await toggleTaskCompletion(taskID, completed);
            setRefresh(!refresh);
        } catch {
            setError('Erreur lors de la mise à jour de la tâche');
        }
    };

    const handleDeleteTask = async (taskID: number) => {
        try {
            await deleteTask(taskID);
            setRefresh(!refresh);
        } catch {
            setError('Erreur lors de la suppression de la tâche');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Liste des tâches pour {petID}</h1>
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <div key={task.TaskID}>
                        <p><strong>Description :</strong> {task.Description || 'Aucune description'}</p>
                        <p><strong>Catégorie :</strong> {task.Categorie || 'Aucune catégorie'}</p>
                        <p><strong>Status :</strong> {task.Completed ? 'Terminée' : 'Non terminée'}</p>
                        <button onClick={() => handleToggleTaskCompletion(task.TaskID, !task.Completed)}>
                            {task.Completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
                        </button>
                        <button onClick={() => handleDeleteTask(task.TaskID)}>Supprimer</button>
                    </div>
                ))
            ) : (
                <p>Aucune tâche pour ce compagnon.</p>
            )}

            <button onClick={handleCreateTask}>Ajouter une tâche</button>
        </div>
    );
};

export default TodoList;
