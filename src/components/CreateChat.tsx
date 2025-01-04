import React, { useEffect, useState } from 'react';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDBClient } from '../DynamoDB';
import { useLocation } from "react-router-dom";
import { getUserInfo } from '../InfoUserService.tsx';

interface LocationState {
    userID: string;
    matchedUserID: string;
}

const ChatMessages: React.FC = () => {
    const location = useLocation();
    const { userID, matchedUserID } = location.state as LocationState;

    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState({
        message_id: '',
        sender_id: userID,
        receiver_id: matchedUserID,
        content: '',
        timestamp: '',
    });
    const [isLoading, setIsLoading] = useState(true); // État de chargement
    const [, setUserFirstName] = useState<string>('Moi');
    const [matchedFirstName, setMatchedFirstName] = useState<string>("Match");

    const fetchUserInfo = async () => {
        try {
            const userInfo = await getUserInfo(userID);
            const matchedUserInfo = await getUserInfo(matchedUserID);
            if (userInfo) setUserFirstName(userInfo.FirstName);
            if (matchedUserInfo) setMatchedFirstName(matchedUserInfo.FirstName);
        } catch (error) {
            console.error('Erreur lors de la récupération des informations utilisateur:', error);
        } finally {
            setIsLoading(false); // Fin du chargement
        }
    };

    const fetchMessages = async () => {
        const command = new ScanCommand({ TableName: 'ChatMessages' });
        try {
            const data = await dynamoDBClient.send(command);
            const filteredMessages = (data.Items || []).filter((msg: any) =>
                (msg.sender_id === userID && msg.receiver_id === matchedUserID) ||
                (msg.sender_id === matchedUserID && msg.receiver_id === userID)
            );
            filteredMessages.sort((a: any, b: any) => parseInt(a.timestamp) - parseInt(b.timestamp));
            setMessages(filteredMessages);
        } catch (error) {
            console.error("Erreur lors de la récupération des messages:", error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
        fetchMessages();
        const intervalId = setInterval(fetchMessages, 4000);
        return () => clearInterval(intervalId);
    }, []);

    const addMessage = async () => {
        const timestamp = Date.now().toString();
        const message_id = timestamp;
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
            setNewMessage({
                message_id: '',
                sender_id: userID,
                receiver_id: matchedUserID,
                content: '',
                timestamp: '',
            });
            fetchMessages();
        } catch (error) {
            console.error("Erreur lors de l'ajout du message:", error);
        }
    };

    if (isLoading) {
        return (
            <div style={styles.loadingContainer}>
                <p style={styles.loadingText}>Loading the chat room ...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Chat Room</h1>
            <div style={styles.chatBox}>
                {messages.map((msg) => (
                    <div
                        key={msg.message_id}
                        style={{
                            ...styles.message,
                            alignSelf: msg.sender_id === userID ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.sender_id === userID ? '#f9b44c' : '#e0e0e0',
                        }}
                    >
                        <p style={styles.messageContent}>
                            <span style={styles.senderName}>
                                {msg.sender_id === userID ? "Me" : matchedFirstName}
                            </span>
                            <br />
                            {msg.content}
                        </p>
                    </div>
                ))}
            </div>
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Write your message ..."
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                    style={styles.input}
                />
                <button onClick={addMessage} style={styles.button}>Send</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: '"Arial", sans-serif',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        marginTop: '5%',
    },
    header: {
        textAlign: 'center' as const,
        marginBottom: '20px',
        color: '#333',
    },
    chatBox: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '10px',
        maxHeight: '400px',
        overflowY: 'auto' as const,
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#fff',
    },
    message: {
        padding: '10px',
        borderRadius: '10px',
        maxWidth: '70%',
        wordWrap: 'break-word' as const,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    },
    messageContent: {
        margin: 0,
        paddingLeft: '5px',
        paddingRight: '5px',
    },
    senderName: {
        fontSize: '0.9em',
        fontWeight: 'bold' as const,
        color: '#555',
        marginBottom: '5px',
    },
    inputContainer: {
        display: 'flex',
        gap: '10px',
    },
    input: {
        flex: 1,
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#f9b44c',
        color: 'white',
        cursor: 'pointer' as const,
        fontWeight: 'bold' as const,
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    loadingText: {
        fontSize: '1.2em',
        color: '#555',
    },
};

export default ChatMessages;