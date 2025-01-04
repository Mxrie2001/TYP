import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserInfo } from '../InfoUserService';
import { getPetsByUser } from '../PetService';
import './Page.css'; // Assurez-vous d'avoir un fichier CSS pour les styles

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
        const fetchMatches = async () => {
            try {
                setLoading(true);
                setError(null);

                const lambdaResponse = await fetch(
                    `https://4amxlrquva.execute-api.us-east-1.amazonaws.com/dev/matches?userID=${userID}`
                );

                if (!lambdaResponse.ok) {
                    throw new Error(`HTTP error! status: ${lambdaResponse.status}`);
                }

                const rawData = await lambdaResponse.json();
                console.log('Response from Lambda:', rawData);

                const data = JSON.parse(rawData.body);
                const matchedUserIDs = data.matches;

                if (!Array.isArray(matchedUserIDs) || matchedUserIDs.length === 0) {
                    setMatches([]);
                    return;
                }

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
                setError('An error occurred while fetching match information.');
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

    if (loading) return <div className="Loading">Loading...</div>;

    if (error) return <div className="Error">Error: {error}</div>;

    return (
        <div className="PageContent">
            <h1 className="Title">My Matches</h1>
            <div className="myMatches">
                {matches.length > 0 ? (
                    matches.map((match, index) => (
                        <div className="MatchCard" key={index}>
                            <h3 className="UserInfo">
                                {match.userInfo.FirstName} {match.userInfo.LastName}
                            </h3>
                            <h4 className="PetListTitle">Pet(s):</h4>
                            {match.pets.length > 0 ? (
                                match.pets.map((pet: any) => (
                                    <div className="PetCard" key={pet.ID}>
                                        <img
                                            src={getPetImage(pet.Type)}
                                            alt={pet.Type}
                                            className="PetImage"
                                        />
                                        <div className="PetDetails">
                                            <p><strong>Name:</strong> {pet.Name}</p>
                                            <p><strong>Type:</strong> {pet.Type}</p>
                                            <p><strong>Age:</strong> {pet.Age} years</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No Pet saved :(</p>
                            )}

                            <button
                                className="ChatButton"
                                onClick={() => handleChat(match.matchedUserID)}
                            >
                                Chat
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="NoMatch">No matching users found.</p>
                )}
            </div>
        </div>
    );
};

export default Match;
