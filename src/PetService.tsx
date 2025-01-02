import { dynamoDBClient } from './DynamoDB'; // Assurez-vous que le client DynamoDB est correctement configuré
import { PutCommand, GetCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const PET_TABLE = 'Pet'; // Nom de la table DynamoDB

// Fonction pour ajouter un animal de compagnie
export const addPet = async (
    userID: string,
    formData: { Name: string; Type: string; Age: number }
): Promise<void> => {
    try {
        const petID = Date.now(); // Générer un ID unique basé sur uuid

        const command = new PutCommand({
            TableName: PET_TABLE,
            Item: {
                ID: petID, // ID unique pour l'animal
                UserID: userID, // Associer l'animal à un utilisateur
                Name: formData.Name, // Nom du compagnon
                Type: formData.Type, // Type (chien, chat, etc.)
                Age: formData.Age, // Âge de l'animal
            },
        });

        await dynamoDBClient.send(command);
        console.log(`Compagnon ajouté avec succès pour l'utilisateur ${userID}.`);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du compagnon :', error);
        throw new Error('Impossible d\'ajouter le compagnon.');
    }
};

// Fonction pour récupérer les informations d'un animal en fonction de son ID
export const getPetInfo = async (petID: string): Promise<{ ID: string; UserID: string; Name: string; Type: string; Age: number } | null> => {
    try {
        const command = new GetCommand({
            TableName: PET_TABLE,
            Key: { ID: petID }, // Rechercher par ID de l'animal
        });

        const data = await dynamoDBClient.send(command);

        if (data.Item) {
            return {
                ID: data.Item.ID,
                UserID: data.Item.UserID,
                Name: data.Item.Name,
                Type: data.Item.Type,
                Age: data.Item.Age,
            };
        } else {
            return null; // Si aucun animal trouvé
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des informations du compagnon :', error);
        throw new Error('Impossible de récupérer les informations du compagnon.');
    }
};

// Fonction pour récupérer tous les animaux d'un utilisateur
export const getPetsByUser = async (userID: string): Promise<{ ID: string; UserID: string; Name: string; Type: string; Age: number }[]> => {
    try {
        const command = new QueryCommand({
            TableName: PET_TABLE,
            IndexName: 'UserID-index', // Assurez-vous que l'index secondaire existe dans la table
            KeyConditionExpression: 'UserID = :userID',
            ExpressionAttributeValues: {
                ':userID': userID,
            },
        });

        const data = await dynamoDBClient.send(command);

        return data.Items?.map((item) => ({
            ID: item.ID,
            Name: item.Name,
            Type: item.Type,
            Age: item.Age,
            UserID: item.UserID,
        })) || []; // Retourne une liste d'animaux ou une liste vide
    } catch (error) {
        console.error('Erreur lors de la récupération des compagnons de l\'utilisateur :', error);
        throw new Error('Impossible de récupérer les compagnons de l\'utilisateur.');
    }
};


// Fonction pour mettre à jour les informations d'un animal de compagnie dans DynamoDB
export const updatePetInfo = async (petID: string, formData: { Name: string; Type: string; Age: number }) => {
    try {
        const command = new UpdateCommand({
            TableName: PET_TABLE,
            Key: {
                ID: petID, // Utilise l'ID du compagnon comme clé primaire
            },
            UpdateExpression: 'set #N = :n, Type = :t, Age = :a', // Remplacer Name par #N
            ExpressionAttributeNames: {
                '#N': 'Name', // Mapper #N à Name
            },
            ExpressionAttributeValues: {
                ':n': formData.Name,
                ':t': formData.Type,
                ':a': formData.Age,
            },
            ReturnValues: 'UPDATED_NEW', // Retourner les nouvelles valeurs mises à jour
        });

        const result = await dynamoDBClient.send(command);
        console.log('Compagnon mis à jour avec succès', result);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du compagnon', error);
        throw new Error('Erreur lors de la mise à jour du compagnon');
    }
};
