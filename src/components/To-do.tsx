import { fetchItemsFromDynamoDBByUserID } from "./DynamoDB.tsx";
import React, { useEffect, useState } from "react";
import { useUser } from './UserContext';

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

    return (
        <div>
            {loading ? (
                <p>Loading...</p> // Message de chargement
            ) : (
                <>
                    {error && <div style={{ color: 'red' }}>{error}</div>}

                    {items.length > 0 ? (
                        <ul>
                            {items.map((item, index) => (
                                <div key={index}>
                                    <h2>{item.Title}</h2>
                                    <p>{item.Content}</p>
                                    <p>{item.CategoryID}</p>
                                    <p>{item.DateFinished}</p>
                                    <p>{item.Deadline}</p>
                                    <p>{item.Priority}</p>
                                    <p>{item.State}</p>
                                    <p>{item.UserID}</p>
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