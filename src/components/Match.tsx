import React, { useState, useEffect } from 'react';

const Match: React.FC = () => {
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // URL de l'API Gateway
        const apiUrl = 'https://4amxlrquva.execute-api.us-east-1.amazonaws.com/dev/matches';

        const fetchLambda = async () => {
            try {
                const res = await fetch(apiUrl);
                const data = await res.json();
                setResponse(data); // Affiche la réponse de Lambda
            } catch (error) {
                console.error('Error calling Lambda:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLambda();
    }, []); // Appel une seule fois au démarrage du composant

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Response from Lambda</h1>
            <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
    );
};

export default Match;
