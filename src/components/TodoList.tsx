import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTasksByPet } from '../TaskService';
import { getPetInfo } from '../PetService';
import { useTask } from '../TaskContext';
import "./Page.css"

interface LocationState {
    petID: string;
    userID: string;
}

const TodoList: React.FC = () => {
    const { tasks, setTasks } = useTask();
    const location = useLocation();
    const navigate = useNavigate();
    const { userID, petID } = location.state as LocationState;

    const [petInfo, setPetInfo] = useState({
        name: '',
        type: '',
        age: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [refresh] = useState(false);

    const getPetImage = (type: string): string => {
        switch (type.toLowerCase()) {
            case 'dog':
                return 'dog.png';
            case 'cat':
                return 'cat.png';
            case 'bird':
                return 'bird.png';
            case 'rabbit':
                return 'bunny.png';
            case 'racoon':
                return 'racoon.png';
            default:
                return 'newPet.jpg';
        }
    };

    useEffect(() => {
        if (!petID || !userID) {
            alert('Impossible de récupérer l’ID du compagnon ou de l’utilisateur. Veuillez réessayer.');
            navigate('/');
            return;
        }

        const fetchPetData = async () => {
            try {
                const petData = await getPetInfo(petID);
                if (petData) {
                    setPetInfo({
                        name: petData.Name,
                        type: petData.Type,
                        age: petData.Age.toString(),
                    });
                } else {
                    console.error('Compagnon non trouvé');
                }
            } catch (error) {
                console.error('Erreur lors du chargement des informations du compagnon', error);
                setError('Erreur lors du chargement des informations du compagnon');
            }
        };

        const fetchTasks = async () => {
            try {
                const fetchedTasks = await getTasksByPet(petID);
                console.log('Tâches récupérées:', fetchedTasks);
                setTasks(fetchedTasks);
            } catch {
                setError('Erreur lors du chargement des tâches');
            }
        };

        fetchPetData();
        fetchTasks();
    }, [petID, userID, refresh, setTasks, navigate]);

    const handleCreateTask = () => {
        navigate('/create-task', { state: { userID, petID } });
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="PageContent">
            <h1 className="Title">{petInfo.name}'s Todos</h1>
            <div className="Container">
                <div className="form-group">
                    <img
                        src={getPetImage(petInfo.type)}
                        alt={`${petInfo.type}`}
                        className="pp"
                    />
                    <div className="InputRegister">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <div className="todos" key={task.TaskID}>
                                    <p><strong>Description :</strong> {task.Description || 'No description'}</p>
                                    <p><strong>Category :</strong> {task.Categorie || 'No catégorie'}</p>
                                </div>
                            ))
                        ) : (
                            <p>No todos for this pet.</p>
                        )}
                    </div>
                    </div>

                    <div className="BtnEdit">
                        <button onClick={handleCreateTask}>Add</button>
                    </div>
                </div>

            </div>
            );
            };

            export default TodoList;
