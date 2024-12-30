import { fetchItemsFromDynamoDBByUserID } from "./DynamoDB.tsx";
import React, { useEffect, useState } from "react";
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';
import { deleteTodo } from './TodoService';

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
                                    <h2>{item.Title}</h2>
                                    <p>{item.Content}</p>
                                    {/*<p>{item.CategoryID}</p>*/}
                                    <p>{item.DateFinished}</p>
                                    <p>{item.Deadline}</p>
                                    <p>{item.Priority}</p>
                                    <p>{item.State}</p>
                                    <button onClick={() => handleDelete(item.ID)}>Supprimer</button>
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