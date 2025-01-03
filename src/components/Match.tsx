import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserInfo } from '../InfoUserService';
import { getPetsByUser } from '../PetService';

interface LocationState {
    userID: string;
}

const Match: React.FC = () => {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const navigate = useNavigate();
    const { userID } = location.state as LocationState;

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                setError(null);

                // Appel à la fonction Lambda
                const lambdaResponse = await fetch(
                    `https://4amxlrquva.execute-api.us-east-1.amazonaws.com/dev/matches?userID=${userID}`
                );

                if (!lambdaResponse.ok) {
                    throw new Error(`HTTP error! status: ${lambdaResponse.status}`);
                }

                const rawData = await lambdaResponse.json();
                console.log('Response from Lambda:', rawData);

                // Désérialiser le `body` si nécessaire
                const data = JSON.parse(rawData.body);

                // Extraire les IDs correspondants
                const matchedUserIDs = data.matches;

                if (!Array.isArray(matchedUserIDs) || matchedUserIDs.length === 0) {
                    setMatches([]); // Pas de correspondances
                    return;
                }

                // Récupérer les informations détaillées pour chaque ID
                const detailedMatches = await Promise.all(
                    matchedUserIDs.map(async (matchedUserID: string) => {
                        const userInfo = await getUserInfo(matchedUserID);
                        const pets = await getPetsByUser(matchedUserID);
                        return { userInfo, pets, matchedUserID };
                    })
                );

                setMatches(detailedMatches);
            } catch (err) {
                console.error(err);
                setError('Une erreur est survenue lors de la récupération des informations.');
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [userID]);

    const handleChat = (matchedUserID: string) => {
        navigate('/chat', {
            state: {
                userID,
                matchedUserID,
            },
        });
    };

    if (loading) return <div>Chargement en cours...</div>;

    if (error) return <div>Erreur: {error}</div>;

    return (
        <div>
            <h1>Résultats de Matching</h1>
            {matches.length > 0 ? (
                matches.map((match, index) => (
                    <div key={index}>
                        <h3>Utilisateur</h3>
                        <p><strong>Prénom:</strong> {match.userInfo.FirstName}</p>
                        <p><strong>Nom:</strong> {match.userInfo.LastName}</p>
                        <p><strong>Email:</strong> {match.userInfo.Email}</p>

                        <h4>Compagnons</h4>
                        {match.pets.length > 0 ? (
                            match.pets.map((pet: any) => (
                                <div key={pet.ID}>
                                    <p><strong>Nom:</strong> {pet.Name}</p>
                                    <p><strong>Type:</strong> {pet.Type}</p>
                                    <p><strong>Âge:</strong> {pet.Age} ans</p>
                                </div>
                            ))
                        ) : (
                            <p>Pas de compagnons enregistrés.</p>
                        )}

                        {/* Bouton Chatter */}
                        <button onClick={() => handleChat(match.matchedUserID)}>Chatter</button>
                    </div>
                ))
            ) : (
                <p>Aucun utilisateur correspondant trouvé.</p>
            )}
        </div>
    );
};

export default Match;
