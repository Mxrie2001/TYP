import { fetchItemsFromDynamoDBByUserID } from "./DynamoDB.tsx";
import React, { useEffect, useState } from "react";
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';
import { deleteTodo } from './TodoService';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';
import 'bootstrap/dist/css/bootstrap.min.css';
import './To-do.css'

function state2badge(state:string):string {
    switch (state) {
        case 'New': return 'info';
        default: return 'secondary';
    }
}

function prio2stack(priority:string):string {
    switch (priority) {
        case 'High': return "itemDanger";
        case 'Medium': return "itemWarn";
        default: return "item";
    }
}

const ToDo: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Définir sur true pour indiquer que les données sont en cours de chargement
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setError(null);

            try {
                // @ts-ignore
                const items = await fetchItemsFromDynamoDBByUserID('Todo', user.ID);
                setItems(items);
            } catch (err) {
                console.error(err);
                // @ts-ignore
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchItems(); // Appeler la fonction pour récupérer les éléments si l'utilisateur est connecté
        }
    }, [user]); // Dépendance pour rerun l'effet si l'utilisateur change

    const handleDelete = async (id: number) => {
        try {
            await deleteTodo(id); // Appel de la fonction pour supprimer la tâche de DynamoDB
            setItems(prevItems => prevItems.filter(item => item.ID !== id)); // Mettre à jour l'état local
        } catch (err) {
            console.error("Erreur lors de la suppression de la tâche:", err);
            setError("Erreur lors de la suppression de la tâche.");
        }
    };

    return (
        <div>
            <h1>My to do List</h1>
            <div className="TaskResearch" >
                <div>
                    <label>
                        <input type="text" id="search" name="search" width={20}/>
                    </label>
                </div>
                <button>Search</button>
            </div>
            <button><Link to="/add-todo">Ajouter une nouvelle tâche</Link></button>

            {loading ? (
                <p>Loading...</p> // Message de chargement
            ) : (
                <>
                    {error && <div style={{color: 'red'}}>{error}</div>}

                    {items.length > 0 ? (
                        <ul>

                            {items.map((item, index) => (
                                <div key={index}>
                                    <div className={prio2stack(item.Priority)}>
                                        <div className="taskTitle">{item.Title}</div>
                                        <div className="taskContent">{item.Content}</div>
                                        {/*<p>{item.CategoryID}</p>*/}
                                        <div className="taskFinisihed">{item.DateFinished}</div>
                                        <Badge bg={"danger"}>{item.Deadline}</Badge>
                                        {/*{item.Priority}*/}
                                        <Badge bg={state2badge(item.State)}>{item.State}</Badge>
                                        <div className="p-2 ms-auto">
                                            <button vertical-align:middle onClick={() => handleDelete(item.ID)}>Supprimer</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <p>Aucun élément trouvé.</p> // Message lorsque aucun élément n'est trouvé
                    )}
                </>
            )}
        </div>
    );
};

export default ToDo;