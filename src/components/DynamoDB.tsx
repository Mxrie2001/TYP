import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

export const dynamoDBClient = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'ASIA52DQ3ZZBZVFTVFJK',
        secretAccessKey: '7ddDfOIa4ryHOeeN8lEwQRetb499UwKa6EeBdFMD',
        sessionToken: 'IQoJb3JpZ2luX2VjELX//////////wEaCXVzLXdlc3QtMiJIMEYCIQDEKxrPYb2FdoKlU7N9q9hCoeTHsmIcLmVer2HyCJhWZQIhALKfBl4MJte6X09dyDW6OLxYpBeTKWsZzV+4Jx0sP3baKroCCI7//////////wEQABoMOTQ5NDI0NDc1NzE1Igy2Hm3ItoFHvW3eKPUqjgKnkyFNaASzSrZbgcfoVRUn72eRInsMAoRpz9RQgRt+jYEUfMhNgEPKEYXy0qC+Z3Uiay1NQ1wQx55dOLcj2cpFiyJCnwCmkJhNq7j3iFtGhXvaH6yctsJjlcBs1sY5ROFv5aSeEr2zeRvcxW8p/AUGRLZJAE0JJLGgyrfVFjBqmc4j+137mBa0PQwZ1XSTtdzuOsZTRz0El/SbG4rIpeLven3XvZ8dEzoagC/Kla0toOO84C4tWzSIoPMJgHWqi4k3n1XrbGqlyBDhqgoXA4UW6KAGooYUdf98Rc+CXyB1HFOYmIt/OkkON3RfYYS3NxegFui/xxBBeOsIF7XJxDszkezKwYQ7VWyryTiP67MwsanKuwY6nAHg7TxFumXHV0QsSsn0+0iKsL6KOqJuAAZchOD2UnTda+oGNeEIyslFECNYknOTDlrl2a4QjcX8FOJy+qMrGEG+yRi1rVmJeCS1FaUTRU0vcutHO1iVLNVsyb5gzTef21oh2NXUvT27GT1IRLmowdHL5C+IQVNJ60CLdWitdVONI0uH+FU2AAPW3USkL65kQru410t0JcJJYyyP4Pg='},
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