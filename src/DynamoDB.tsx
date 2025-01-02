import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

export const dynamoDBClient = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: '',
        secretAccessKey: '',
    },
});

export const fetchItemsFromDynamoDB = async (tableName: string): Promise<any[]> => {
    try {
        const command = new ScanCommand({ TableName: tableName });
        const data = await dynamoDBClient.send(command);
        return data.Items || [];
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des éléments: ${error}`);
    }
};

export const fetchItemsFromDynamoDBByUserID = async (tableName: string, userID: number | null): Promise<any[]> => {
    try {
        const command = new ScanCommand({
            TableName: tableName,
            FilterExpression: 'UserID = :userID',
            ExpressionAttributeValues: {
                ':userID': userID,
            },
        });

        const data = await dynamoDBClient.send(command);
        return data.Items || [];
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des éléments: ${error}`);
    }
};