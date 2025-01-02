import { dynamoDBClient } from './DynamoDB';
import { PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const TASKS_TABLE = 'Task'; // Nom de la table DynamoDB pour les tâches

// Ajouter une tâche
export const addTask = async (
    userID: string,
    petID: string,
    formData: { Description: string; Categorie: string }
): Promise<void> => {
    try {
        // Générer un ID unique pour la tâche (en utilisant un number)
        const taskID = Date.now();

        // Vérification de la génération de l'ID de la tâche
        console.log("Generated Task ID:", taskID);

        const command = new PutCommand({
            TableName: TASKS_TABLE,
            Item: {
                ID: taskID, // ID unique pour la tâche (number)
                PetID: petID,   // Associer la tâche à un animal
                UserID: userID, // Associer la tâche à un utilisateur
                Description: formData.Description, // Description de la tâche
                Completed: false, // Statut de complétion de la tâche
                Categorie: formData.Categorie, // Catégorie de la tâche
                CreatedAt: new Date().toISOString(), // Date de création de la tâche
            },
        });

        // Envoyer la commande à DynamoDB
        await dynamoDBClient.send(command);
        console.log(`Tâche ajoutée avec succès pour l'utilisateur ${userID} et l'animal ${petID}.`);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche :', error);
        throw new Error('Impossible d\'ajouter la tâche.');
    }
};

export const getTasksByPet = async (petID: string) => {
    try {
        const command = new QueryCommand({
            TableName: TASKS_TABLE,
            IndexName: 'PetID-index',
            KeyConditionExpression: 'PetID = :petID',
            ExpressionAttributeValues: {
                ':petID': petID,
            },
        });

        const data = await dynamoDBClient.send(command);

        return data.Items?.map((item) => ({
            TaskID: item.TaskID,
            PetID: item.PetID,
            UserID: item.UserID,
            Description: item.Description,
            Completed: item.Completed,
            Categorie: item.Categorie,
            CreatedAt: item.CreatedAt,
        })) || []; // Retourne une liste de tâches ou une liste vide
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches de l\'animal :', error);
        throw new Error('Impossible de récupérer les tâches de l\'animal.');
    }
};





// Mettre à jour l'état d'une tâche
export const toggleTaskCompletion = async (taskID: number, completed: boolean): Promise<void> => {
    try {
        const command = new UpdateCommand({
            TableName: TASKS_TABLE,
            Key: { TaskID: taskID },
            UpdateExpression: 'SET Completed = :completed',
            ExpressionAttributeValues: { ':completed': completed },
        });
        await dynamoDBClient.send(command);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la tâche', error);
        throw new Error('Impossible de mettre à jour la tâche');
    }
};

// Supprimer une tâche
export const deleteTask = async (taskID: number): Promise<void> => {
    try {
        const command = new DeleteCommand({
            TableName: TASKS_TABLE,
            Key: { TaskID: taskID },
        });
        await dynamoDBClient.send(command);
    } catch (error) {
        console.error('Erreur lors de la suppression de la tâche', error);
        throw new Error('Impossible de supprimer la tâche');
    }
};
