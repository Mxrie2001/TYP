import { dynamoDBClient } from './DynamoDB'; // Assurez-vous que le client DynamoDB est correctement configuré
import { PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const INFOUSER_TABLE = 'InfoUser'; // Le nom de ta table DynamoDB

// Fonction pour ajouter un utilisateur vide avec l'ID de Cognito
export const registerUserInDynamoDB = async (
    userID: string,
    formData: { firstname: string; lastname: string; email: string }
): Promise<void> => {
    try {
        const command = new PutCommand({
            TableName: INFOUSER_TABLE,
            Item: {
                ID: userID, // Utilise 'ID' comme clé de partition
                FirstName: formData.firstname, // Prénom récupéré du formulaire
                LastName: formData.lastname, // Nom de famille récupéré du formulaire
                Email: formData.email, // Email récupéré du formulaire
            },
            ConditionExpression: 'attribute_not_exists(ID)', // Empêcher l'écrasement des utilisateurs existants avec le même ID
        });

        // Envoi de la commande à DynamoDB
        await dynamoDBClient.send(command);
        console.log(`Utilisateur ${userID} ajouté à DynamoDB avec succès.`);
    } catch (error) {
        console.error(`Erreur lors de l'ajout de l'utilisateur ${userID} dans DynamoDB:`, error);
        throw new Error(`Impossible d'ajouter l'utilisateur ${userID}`);
    }
};

// Fonction pour récupérer les informations utilisateur
export const getUserInfo = async (userID: string): Promise<{ UserID: string; FirstName: string; LastName: string; Email: string } | null> => {
    try {
        const command = new GetCommand({
            TableName: INFOUSER_TABLE,
            Key: { ID: userID },  // Utiliser l'ID comme clé primaire
        });

        const data = await dynamoDBClient.send(command);

        if (data.Item) {
            return {
                UserID: data.Item.ID,
                FirstName: data.Item.FirstName,
                LastName: data.Item.LastName,
                Email: data.Item.Email,
            };
        } else {
            return null; // Si l'utilisateur n'est pas trouvé
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
        throw new Error('Impossible de récupérer les informations utilisateur');
    }
};

// Fonction pour mettre à jour les informations utilisateur dans DynamoDB
export const updateUserInfo = async (userID: string, formData: { FirstName: string, LastName: string, Email: string }) => {
    try {
        const command = new UpdateCommand({
            TableName: INFOUSER_TABLE,
            Key: {
                ID: userID, // Utilise l'ID de l'utilisateur comme clé
            },
            UpdateExpression: 'set FirstName = :f, LastName = :l, Email = :e',
            ExpressionAttributeValues: {
                ':f': formData.FirstName,
                ':l': formData.LastName,
                ':e': formData.Email,
            },
            ReturnValues: 'UPDATED_NEW', // Retourner les nouvelles valeurs mises à jour
        });

        // Envoi de la commande à DynamoDB
        const result = await dynamoDBClient.send(command);
        console.log('Utilisateur mis à jour avec succès', result);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
    }
};

export const userExist = async (userID: string): Promise<boolean> => {
    try {
        const command = new GetCommand({
            TableName: INFOUSER_TABLE,
            Key: { ID: userID },  // Utiliser l'ID comme clé primaire
        });

        const data = await dynamoDBClient.send(command);

        // Si l'utilisateur existe (les données sont retournées)
        if (data.Item) {
            return true;
        } else {
            return false; // Si l'utilisateur n'existe pas
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'existence de l\'utilisateur:', error);
        throw new Error('Impossible de vérifier l\'existence de l\'utilisateur');
    }
};