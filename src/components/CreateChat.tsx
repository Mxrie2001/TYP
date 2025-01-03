import React, { useEffect, useState } from 'react';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDBClient } from '../DynamoDB.tsx';
import { useLocation } from "react-router-dom";

interface LocationState {
    userID: string;
    matchedUserID: string;
}

// Composant pour afficher et ajouter des messages
const ChatMessages: React.FC = () => {
    const location = useLocation();
    const { userID } = location.state as LocationState;
    const { matchedUserID } = location.state as LocationState;

    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState({
        message_id: '',  // On ne définit pas ici pour éviter le vide
        sender_id: userID,
        receiver_id: matchedUserID,
        content: '',
        timestamp: '',
    });

    // Récupérer tous les messages
    const fetchMessages = async () => {
        const command = new ScanCommand({ TableName: 'ChatMessages' });
        try {
            const data = await dynamoDBClient.send(command);
            // Filtrer les messages pour ne garder que ceux entre l'expéditeur et le destinataire
            const filteredMessages = (data.Items || []).filter((msg: any) =>
                (msg.sender_id === userID && msg.receiver_id === matchedUserID) ||
                (msg.sender_id === matchedUserID && msg.receiver_id === userID)
            );

            // Trier les messages par timestamp dans l'ordre croissant
            filteredMessages.sort((a: any, b: any) => {
                return parseInt(a.timestamp) - parseInt(b.timestamp);
            });

            setMessages(filteredMessages);
        } catch (error) {
            console.error("Erreur lors de la récupération des messages:", error);
        }
    };

    useEffect(() => {
        fetchMessages();

        const intervalId = setInterval(() => {
            fetchMessages(); // Appel de la fonction pour actualiser les messages
        }, 5000); // Actualise toutes les 5 secondes

        return () => clearInterval(intervalId); // Nettoyage de l'intervalle
    }, []);

    // Ajouter un nouveau message
    const addMessage = async () => {
        const timestamp = Date.now().toString(); // Générer un nouveau timestamp
        const message_id = timestamp; // Utiliser le timestamp comme message_id

        const command = new PutCommand({
            TableName: 'ChatMessages',
            Item: {
                message_id,
                sender_id: newMessage.sender_id,
                receiver_id: newMessage.receiver_id,
                content: newMessage.content,
                timestamp,
            },
        });

        try {
            await dynamoDBClient.send(command);
            // Réinitialiser le formulaire avec un nouvel message_id
            setNewMessage({
                message_id: '', // Cela n'est plus nécessaire car on génère à chaque envoi
                sender_id: userID,
                receiver_id: matchedUserID,
                content: '',
                timestamp: '',
            });
            fetchMessages(); // Re-récupérer les messages après ajout
        } catch (error) {
            console.error("Erreur lors de l'ajout du message:", error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Messages de chat</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {messages.map((msg) => (
                    <div
                        key={msg.message_id}
                        style={{
                            alignSelf: msg.sender_id === userID ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.sender_id === userID ? '#f9b44C' : '#f1f1f1',
                            borderRadius: '10px',
                            padding: '10px',
                            maxWidth: '70%',
                            wordWrap: 'break-word',
                        }}
                    >
                        <p style={{ margin: 0 }}>{msg.content} <span style={{ fontSize: '0.8em', color: '#888' }}>(de {msg.sender_id} à {msg.receiver_id})</span></p>
                    </div>
                ))}
            </div>

            <h2>Envoyer un message</h2>
            <input
                type="text"
                placeholder="Contenu"
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
            />
            <button
                onClick={addMessage}
                style={{ padding: '10px 15px', borderRadius: '5px', border: 'none', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}
            >
                Envoyer
            </button>
        </div>
    );
};

export default ChatMessages;
