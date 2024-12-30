import { dynamoDBClient } from './DynamoDB.tsx'; // Assurez-vous que le client DynamoDB est configuré
import { PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const TODOS_TABLE = 'Todo';

// Fonction pour créer une tâche
export const createTodo = async (title: string, content: string, state: string, userId: number, deadline: string, priority: number) => {
    try {
        const timestamp = Date.now();

        const command = new PutCommand({
            TableName: TODOS_TABLE,
            Item: {
                ID: timestamp,
                Title: title,
                Content: content,
                State: state,
                UserID: userId,
                Deadline: deadline,
                DateCheck: null, // Initialement vide
                Priority: priority
            },
        });

        await dynamoDBClient.send(command);
    } catch (error) {
        throw new Error(`Erreur lors de la création de la tâche: ${error}`);
    }
};

// Fonction pour supprimer une tâche
export const deleteTodo = async (id: number) => {
    try {
        const command = new DeleteCommand({
            TableName: TODOS_TABLE,
            Key: {
                ID: id,
            },
        });

        await dynamoDBClient.send(command);
    } catch (error) {
        throw new Error(`Erreur lors de la suppression de la tâche: ${error}`);
    }
};

// Fonction pour modifier une tâche
// export const editTodo = async (id, updates) => {
//     try {
//         const updateExpressions = [];
//         const expressionAttributeNames = {};
//         const expressionAttributeValues = {};
//
//         for (const key in updates) {
//             updateExpressions.push(`#${key} = :${key}`);
//             expressionAttributeNames[`#${key}`] = key;
//             expressionAttributeValues[`:${key}`] = updates[key];
//         }
//
//         const command = new UpdateCommand({
//             TableName: TODOS_TABLE,
//             Key: {
//                 ID: id,
//             },
//             UpdateExpression: `SET ${updateExpressions.join(', ')}`,
//             ExpressionAttributeNames: expressionAttributeNames,
//             ExpressionAttributeValues: expressionAttributeValues,
//         });
//
//         await dynamoDBClient.send(command);
//     } catch (error) {
//         throw new Error(`Erreur lors de la modification de la tâche: ${error}`);
//     }
// };
